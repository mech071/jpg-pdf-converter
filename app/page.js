"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";

export default function FileDrop() {
  const [files, setFiles] = useState([]);

  function handleFiles(selected) {
    setFiles([...selected]);
  }

  function onDrop(e) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }

  function onDragOver(e) {
    e.preventDefault();
  }

  return (
    <>
      <Navbar />

      <div className="flex flex-col items-center px-4 md:px-0 pt-8 md:pt-12 gap-6">
        <div className="text-2xl md:text-4xl font-semibold text-center">
          Convert JPG to PDF for free
        </div>

        <form
          action="/api/jpg-pdf"
          method="POST"
          encType="multipart/form-data"
          className="flex flex-col items-center gap-6 w-full"
        >
          <input
            id="fileInput"
            name="files"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onClick={() => document.getElementById("fileInput").click()}
            className="w-full max-w-md md:max-w-xl h-32 md:h-48 border-2 border-dashed border-gray-400 flex items-center justify-center text-sm md:text-base text-center cursor-pointer hover:bg-gray-50 transition"
          >
            Drop files here or click to upload
          </div>

          <div className="w-full max-w-md md:max-w-xl text-sm md:text-base">
            {files.length > 0 &&
              files.map((f, i) => (
                <div key={i} className="truncate">
                  {f.name}
                </div>
              ))}
          </div>

          <button
            type="submit"
            className="bg-rose-400 hover:bg-rose-500 text-white px-5 py-2 md:px-6 md:py-3 text-sm md:text-base rounded transition"
          >
            Convert to PDF
          </button>
        </form>
      </div>
    </>
  );
}