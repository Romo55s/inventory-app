import React, { useState } from "react";

const TextCard = ({
  t,
  i,
  imageUrl,
}: {
  t: string;
  i: number;
  imageUrl: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const copyToClipBoard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <div
        className="rounded-lg shadow-md p-4 bg-gray-900 cursor-pointer mb-5"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-semibold">
            {`(${i + 1}) `}
            {new Date().toLocaleString("en-US", {
              timeZone: "America/Mexico_City",
            })}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              copyToClipBoard(t);
            }}
            className="bg-gray-200 text-black text-xs rounded-md px-3 py-1 transition-all hover:text-white hover:bg-gray-800"
          >
            Copy
          </button>
        </div>
        <div className="flex items-center gap-2">
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Uploaded"
              className="w-[8vh] h-[8vh] rounded-md"
            />
          )}
          <input
            className="w-auto p-1 text-sm outline-none bg-gray-800 rounded-md"
            defaultValue={t}
            type="text"
          />
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-3/4 max-w-8xl">
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg font-semibold">
                {`(${i + 1}) `}
                {new Date().toLocaleString("en-US", {
                  timeZone: "America/Mexico_City",
                })}
              </p>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-200 text-black text-xs rounded-md px-3 py-1 transition-all hover:text-white hover:bg-gray-800"
              >
                Close
              </button>
            </div>
            <div className="flex items-center gap-4">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Uploaded"
                  className="w-[80vh] h-[80vh] rounded-md"
                />
              )}
              <input
                className="w-full p-2 text-lg outline-none bg-gray-800 rounded-md"
                defaultValue={t}
                type="text"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TextCard;