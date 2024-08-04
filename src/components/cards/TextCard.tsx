import React from "react";

const TextCard = ({t,i}:{t:string, i:number}) => {
  const copyToClipBoard = (text: string) => {
    navigator.clipboard.writeText(text);
  }
  return (
    <div className="">
      <div className="flex w-full items-center justify-between mb-5 px-5">
        <p className="text-xl font-[600]">{`(${i + 1}) `}
          {new Date().toLocaleString("en-US", {
            timeZone: "America/Mexico_City",
          })}
        </p>
        <button onClick={() =>{
            copyToClipBoard(t);
        }} className="bg-white text-black text-sm md:text-base rounded-md px-5 py-2 transition-all hover:text-white hover:bg-slate-900">
          Copy
        </button>
      </div>
      <textarea
        className="w-full p-5 min-h-[30vh] outline-none bg-slate-900 rounded-xl"
        defaultValue={t}
      ></textarea>
    </div>
  );
};

export default TextCard;
