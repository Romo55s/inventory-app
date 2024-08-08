import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import path from 'path';
import { spawn } from 'child_process';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Límite de tamaño de archivo: 10MB
});
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

// Function to delete all files in the uploads directory
const clearUploadsDirectory = () => {
  const directory = 'uploads/';
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    }
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Clear the uploads directory
  clearUploadsDirectory();

  try {
    await runMiddleware(req, res, multerMiddleware);

    const files = (req as any).files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'Image files are required' });
    }

    const scriptPath = path.join(process.cwd(), 'src', 'lib', 'process_image.py');
    const pythonPath = path.join(process.cwd(), 'venv', 'Scripts', 'python.exe');
    const results: { text: string, processingTime: number }[] = [];

    let totalProcessingTime = 0;

    for (const file of files) {
      const filePath = file.path;
      console.log(`Processing file: ${filePath}`); // Log para depuración

      const processingResult = await new Promise<{ text: string, processingTime: number }>((resolve, reject) => {
        const process = spawn(pythonPath, [scriptPath, filePath]);

        let stdout = '';
        let stderr = '';

        process.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        process.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        process.on('close', (code) => {
          if (code !== 0) {
            return reject(new Error(`Process exited with code ${code}: ${stderr}`));
          }
          console.log('stdout:', stdout); // Agregar log para depuración
          console.log('stderr:', stderr); // Agregar log para depuración
          try {
            const output = JSON.parse(stdout);
            resolve({
              text: output.text,
              processingTime: output.processing_time
            });
          } catch (error) {
            reject(new Error('Failed to parse processing result'));
          }
        });
      });

      totalProcessingTime += processingResult.processingTime;
      results.push(processingResult);
    }

    const averageProcessingTime = totalProcessingTime / files.length;
    const estimatedTotalTime = averageProcessingTime * files.length;
    console.log(`Average processing time per image: ${averageProcessingTime} seconds`);
    console.log(`Estimated total processing time: ${estimatedTotalTime} seconds`);

    return res.status(200).json({ 
      message: 'Images processed successfully', 
      averageProcessingTime,
      estimatedTotalTime,
      results 
    });
  } catch (error) {
    console.error(`Internal server error: ${error}`); // Log para depuración
    return res.status(500).json({ error: 'Internal server error', details: error });
  }
};

export const config = {
  api: {
    bodyParser: false, // Deshabilitar el bodyParser para que multer pueda manejar el formulario
    sizeLimit: '10mb', // Aumentar el límite de tamaño del cuerpo a 10mb
  },
};

export default handler;