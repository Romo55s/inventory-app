"use client";

import { CiImageOn } from "react-icons/ci";
import { useRef, useState } from "react";
import TextCard from "@/components/cards/TextCard";

export default function Home() {
  const imgInputRef = useRef<HTMLInputElement | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [texts, setTexts] = useState<string[]>([]); 
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const openBrowse = () => {
    imgInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      console.error("No files selected");
      return;
    }
    processFiles(Array.from(files));
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) {
      console.error("No files dropped");
      return;
    }
    processFiles(Array.from(files));
  };

  const processFiles = async (files: File[]) => {
    const urls = files.map(file => URL.createObjectURL(file));
    setImageUrls(prevUrls => [...prevUrls, ...urls]);

    setProcessing(true);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('imagePath', file));

      const response = await fetch('/api/process-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log(data.results); 
      setTexts(prevTexts => [...prevTexts, ...data.results]); // Agregar los nuevos resultados al array existente
    } catch (error) {
      console.error('Error processing images:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className="text-white">
      <h2 className="px-5 pt-10 text-center md:text-6xl text-3xl font-[800]">
        Upload the{" "}
        <span className="bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text">
          images
        </span>
      </h2>
      <input
        type="file"
        hidden
        ref={imgInputRef}
        required
        multiple
        onChange={handleFileChange}
      />
      <div className="w-full md:px-20 p-5 flex items-center justify-center cursor-pointer">
        <div
          onClick={openBrowse}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="bg-slate-900 min-h-[50vh] w-full p-5 rounded-xl flex items-center justify-center"
        >
          <div className="flex items-center justify-center flex-col">
            <p className="text-center text-3xl font-[700] text-slate-700">
              {processing
                ? "Processing Images ..."
                : "Browse Or Drop Your Images Here"}
            </p>
            <span className="text-[150px] text-slate-700">
              <CiImageOn className={processing ? "animate-pulse" : ""} />
            </span>
          </div>
        </div>
      </div>
      <div className="my-10 md:px-20 px-5">
        {texts.map((text, index) => (
          <TextCard key={index} i={index} t={text} imageUrl={imageUrls[index] || ""} />
        ))}
      </div>
    </main>
  );
}