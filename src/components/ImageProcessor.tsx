"use client";

import React, { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';

interface ImageProcessorProps {
  // You can add additional props here if needed (e.g., for error handling)
}

const ImageProcessor: React.FC<ImageProcessorProps> = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [cv, setCv] = useState<any>(null);

  useEffect(() => {
    // Dynamically import opencv.js
    import('opencv.js').then((opencv) => {
      setCv(opencv);
    }).catch((err) => {
      console.error('Failed to load opencv.js', err);
    });
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result && cv) {
          const img = new Image();
          img.src = e.target.result as string;
          img.onload = async () => {
            const src = cv.imread(img);
            const matData = src.data;
            const imageData = new ImageData(new Uint8ClampedArray(matData), src.cols, src.rows);
            const canvas = document.createElement('canvas');
            canvas.width = src.cols;
            canvas.height = src.rows;
            const ctx = canvas.getContext('2d')!;
            ctx.putImageData(imageData, 0, 0);

            // Recognize text using Tesseract
            const { data: { text } } = await Tesseract.recognize(canvas);
            setRecognizedText(text);

            src.delete();
          };
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} />
      <p>{recognizedText}</p>
    </div>
  );
};

export default ImageProcessor;