"use client";

import Image from "next/image";
import { CiImageOn } from "react-icons/ci";
import { useRef } from "react";
import convertor from "@/lib/convert";

export default function Home() {
  const imgInputRef: any = useRef(null);
  const openBrowse = () => {
    imgInputRef.current?.click();
  };
  const convert = (url: string) => {
    if(url){
      convertor(url);
    }
  }
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
          const url : string = URL.createObjectURL(e.target.files![0]);
          convert(url);
        }}
      />
      <div onClick={openBrowse} className="w-full md:px-20 p-5 flex items-center justify-center cursor-pointer">
        <div className="bg-slate-900 min-h-[50vh] w-full p-5 rounded-xl flex items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <p className="text-center text-3xl font-[700] text-slate-800">
              Browse Or Drop Your Image Here
            </p>
            <span className="text-[150px] text-slate-800">
              <CiImageOn />
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
