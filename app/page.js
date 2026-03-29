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

  async function uploadFiles() {
    if (!files.length) return;

    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }

    const res = await fetch("/api/jpg-pdf", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      console.error("Upload failed");
      return;
    }

    const blob = await res.blob();

    if (blob.size === 0) {
      console.error("Empty buffer received");
      return;
    }

    const firstFile = files[0];
    let baseName = "output";

    if (firstFile?.name) {
      baseName = firstFile.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[^\w\-]+/g, "_");
    }

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${baseName}.pdf`;

    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  }

  return (
    <>
      <Navbar />

      <div className="flex flex-col items-center px-4 md:px-0 pt-8 md:pt-12 gap-6">
        <div className="text-2xl md:text-4xl font-semibold text-center">
          Convert JPG to PDF for free
        </div>

        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onClick={() => document.getElementById("fileInput").click()}
          className="w-full max-w-md md:max-w-xl h-32 md:h-48 border-2 border-dashed border-gray-400 flex items-center justify-center text-sm md:text-base text-center cursor-pointer hover:bg-gray-50 transition"
        >
          Drop files here or click to upload
        </div>

        <input
          id="fileInput"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="w-full max-w-md md:max-w-xl text-sm md:text-base">
          {files.length > 0 &&
            files.map((f, i) => (
              <div key={i} className="truncate">
                {f.name}
              </div>
            ))}
        </div>

        <button
          onClick={uploadFiles}
          className="bg-rose-400 hover:bg-rose-500 text-white px-5 py-2 md:px-6 md:py-3 text-sm md:text-base rounded transition"
        >
          Convert to PDF
        </button>
      </div>
    </>
  );
}