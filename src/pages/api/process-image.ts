import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import path from 'path';
import { promisify } from 'util';
import { execFile } from 'child_process';
import fs from 'fs-extra';

const execFileAsync = promisify(execFile);

const upload = multer({ dest: 'uploads/' });
const multerMiddleware = upload.array('imagePath'); // Cambiado a array para múltiples archivos

const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: Function) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    await fs.emptyDir(uploadsDir);
    console.log('Uploads directory cleared');

    await runMiddleware(req, res, multerMiddleware);

    const files = (req as any).files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'Image files are required' });
    }

    const scriptPath = path.join(process.cwd(), 'src', 'lib', 'process_image.py');
    const pythonPath = path.join(process.cwd(), 'venv', 'Scripts', 'python.exe');

    const results = [];
    for (const file of files) {
      const filePath = path.join(process.cwd(), file.path);
      console.log(`Processing file: ${filePath}`); // Log para depuración
      try {
        const { stdout, stderr } = await execFileAsync(pythonPath, [scriptPath, filePath]);

        if (stderr) {
          console.error(`Error processing file ${filePath}: ${stderr}`); // Log para depuración
          return res.status(500).json({ error: 'Failed to process image', details: stderr });
        }

        results.push(stdout.trim());
      } catch (error) {
        console.error(`Exception processing file ${filePath}: ${error}`); // Log para depuración
        return res.status(500).json({ error: 'Failed to process image', details: error });
      }
    }

    res.status(200).json({ results });
  } catch (error) {
    console.error(`Internal server error: ${error}`); // Log para depuración
    res.status(500).json({ error: 'Internal server error', details: error });
  }
};

export const config = {
  api: {
    bodyParser: false, // Deshabilitar el bodyParser para que multer pueda manejar el formulario
    sizeLimit: '10mb', // Aumentar el límite de tamaño del cuerpo a 10mb
  },
};

export default handler;