"use client";

import { CiImageOn } from "react-icons/ci";
import { useRef, useState } from "react";
import TextCard from "@/components/cards/TextCard";

export default function Home() {
  const imgInputRef = useRef<HTMLInputElement | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [texts, setTexts] = useState<Array<string>>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const openBrowse = () => {
    imgInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.error("No file selected");
      return;
    }
    processFile(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) {
      console.error("No file dropped");
      return;
    }
    processFile(file);
  };

  const processFile = async (file: File) => {
    const url = URL.createObjectURL(file);
    console.log("File:", file);
    console.log("URL:", url);
    setImageUrl(url);

    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append('imagePath', file); // Usa el objeto file directamente

      const response = await fetch('/api/process-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setTexts([data.result]);
    } catch (error) {
      console.error('Error processing image:', error);
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
                ? "Processing Image ..."
                : "Browse Or Drop Your Image Here"}
            </p>
            <span className="text-[150px] text-slate-700">
              <CiImageOn className={processing ? "animate-pulse" : ""} />
            </span>
          </div>
        </div>
      </div>
      <div className="my-10 md:px-20 px-5">
        {texts.map((t, i) => (
          <TextCard key={i} i={i} t={t} imageUrl={imageUrl || ""} />
        ))}
      </div>
    </main>
  );
}