"use client";

import { CiImageOn, CiWarning } from "react-icons/ci";
import { useRef, useState } from "react";
import TextCard from "@/components/cards/TextCard";

export default function Home() {
  const imgInputRef = useRef<HTMLInputElement | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [texts, setTexts] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [averageProcessingTime, setAverageProcessingTime] = useState<
    number | null
  >(null);
  const [progress, setProgress] = useState<number>(0);

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
    const urls = files.map((file) => URL.createObjectURL(file));
    setImageUrls((prevUrls) => [...prevUrls, ...urls]);

    setProcessing(true);
    setProgress(0); // Reset progress
    try {
      const formData = new FormData();
      files.forEach((file) => {
        console.log("Appending file to formData:", file); // Log para depuración
        formData.append("imagePath", file);
      });

      const response = await fetch("/api/process-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data); // Log para depuración

      // Simulate progress update
      const totalImages = files.length;
      data.results.forEach((result: { text: string }, index: number) => {
        setTexts((prevTexts) => [...prevTexts, result.text]);
        setProgress(((index + 1) / totalImages) * 100); // Update progress
      });

      setAverageProcessingTime(data.averageProcessingTime);
    } catch (error) {
      console.error("Error processing images:", error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className="text-white">
      <div className="flex flex-col md:flex-row">
        <div className="flex flex-col w-full md:w-1/2">
          <h2 className="px-5 pt-10 text-center md:text-6xl text-3xl font-[800]">
            Upload the{" "}
            <span className="bg-gradient-to-r from-blue-500 to-slate-700 text-transparent bg-clip-text">
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
              className="bg-slate-900 min-h-[60vh] w-full p-5 rounded-xl flex items-center justify-center"
            >
              <div className="flex items-center justify-center flex-col">
                <p className="text-center text-3xl font-[700] text-slate-700">
                  {processing
                    ? "Processing Images ..."
                    : averageProcessingTime !== null
                    ? `Average Processing Time: ${averageProcessingTime.toFixed(
                        2
                      )} seconds`
                    : "Browse Or Drop Your Images Here"}
                </p>
                <span className="text-[150px] text-slate-700">
                  <CiImageOn className={processing ? "animate-pulse" : ""} />
                </span>
                {processing && (
                  <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                    <div
                      className="bg-blue-600 h-4 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <div className="my-16 md:px-20 px-5 h-[80vh] flex items-center justify-center">
            {texts.length === 0 ? (
              <div className="flex flex-col items-center justify-center">
                <span className="text-[100px] text-slate-700 mb-4">
                  <CiWarning />
                </span>
                <p className="text-center text-3xl font-[700] text-slate-700">
                  No data loaded
                </p>
              </div>
            ) : (
              <div className="h-[80vh] overflow-y-auto">
                {texts.map((text, index) => (
                  <TextCard
                    key={index}
                    i={index}
                    t={text}
                    imageUrl={imageUrls[index] || ""}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
