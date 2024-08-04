"use client";

import Image from "next/image";
import { CiImageOn } from "react-icons/ci";
import { useRef, useState } from "react";
import convertor from "@/lib/convert";
import { text } from "stream/consumers";
import TextCard from "@/components/cards/TextCard";

export default function Home() {
  const imgInputRef: any = useRef(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [texts, setText] = useState<Array<string>>([]);
  const openBrowse = () => {
    imgInputRef.current?.click();
  };
  const convert = async (url: string) => {
    if (url) {
      setProcessing(true);
      await convertor(url).then((text: string) => {
        if (text) {
          const copyText = texts;
          copyText.push(text);
          setText(copyText);
          console.log(text);
        }
      });
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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const url: string = URL.createObjectURL(e.target.files![0]);
          convert(url);
        }}
      />
      <div className="w-full md:px-20 p-5 flex items-center justify-center cursor-pointer">
        <div
          onClick={openBrowse}
          onDrop={(e: any) => {
            e.preventDefault();
            const url: string = URL.createObjectURL(e.dataTransfer.files![0]);
            convert(url);
          }}
          onDragOver={(e: any) => {
            e.preventDefault();
          }}
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
        {texts.map((t, i) => {
          return <TextCard key={i} i={i} t={t} />;
        })}
      </div>
    </main>
  );
}
