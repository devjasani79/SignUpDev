import { useState } from "react";

export default function UploadAndPreviewPDF({ onPreview }) {
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file || file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }
    onPreview(file, URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className={`p-6 border-2 rounded-lg transition ${dragging ? "border-blue-500 bg-blue-50" : "border-dashed"}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <p className="text-center text-gray-600">Drag & drop a PDF here</p>
      <p className="text-center text-gray-400 italic">or click to browse</p>
      <input type="file" accept="application/pdf" className="w-full mt-2" onChange={e => handleFile(e.target.files[0])} />
    </div>
  );
}
