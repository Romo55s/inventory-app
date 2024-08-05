import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';

// Promisify execFile for async/await usage
const execFileAsync = promisify(execFile);

// Configurar multer para manejar la carga de archivos
const upload = multer({ dest: 'uploads/' });

// Middleware para manejar la carga de archivos con multer
const multerMiddleware = upload.single('imagePath');

export const config = {
  api: {
    bodyParser: false, // Deshabilitar el análisis del cuerpo de la solicitud por defecto
  },
};

// Convertir multer a una promesa
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
    await runMiddleware(req, res, multerMiddleware);

    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const scriptPath = path.join(process.cwd(), 'src', 'lib', 'process_image.py');
    const filePath = path.join(process.cwd(), file.path);

    // Ruta completa al intérprete de Python en el entorno virtual
    const pythonPath = path.join(process.cwd(), 'venv', 'Scripts', 'python.exe');

    try {
      const { stdout, stderr } = await execFileAsync(pythonPath, [scriptPath, filePath]);

      if (stderr) {
        return res.status(500).json({ error: 'Failed to process image', details: stderr });
      }

      res.status(200).json({ result: stdout.trim() });
    } catch (error) {
      console.log('Error processing image:', error);
      res.status(500).json({ error: 'Failed to process image', details: error });
    }
  } catch (error) {
    console.log('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file', details: error });
  }
};

export default handler;
