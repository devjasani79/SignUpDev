import { useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import axios from "../api/api";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const googleFonts = [
  { name: "Pacifico", url: "https://fonts.googleapis.com/css2?family=Pacifico&display=swap" },
  { name: "Great Vibes", url: "https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" },
  { name: "Dancing Script", url: "https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap" },
];
googleFonts.forEach(f => {
  const link = document.createElement("link");
  link.href = f.url; link.rel = "stylesheet";
  document.head.appendChild(link);
});

export default function SignAndSavePDF({ file, previewUrl, onSave }) {
  const [numPages, setNumPages] = useState(null);
  const [signatureText, setSignatureText] = useState("Your Name");
  const [selectedFont, setSelectedFont] = useState(googleFonts[0]);
  const [signatures, setSignatures] = useState([]);
  const [saving, setSaving] = useState(false);
  const dragIndex = useRef(null);

  const handleDrop = (e, pageNum) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSignatures(prev => [...prev, { page: pageNum, x, y, font: selectedFont.name, text: signatureText }]);
  };

  const handleSave = async () => {
    if (!file || signatures.length === 0) {
      alert("Upload and drop at least one signature.");
      return;
    }
    setSaving(true);
    try {
      const arr = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arr);
      const helv = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();

      pages.forEach((page, idx) => {
        signatures.filter(s => s.page === idx + 1).forEach(sig => {
          page.drawText(sig.text, {
            x: sig.x,
            y: page.getHeight() - sig.y,
            size: 26,
            font: helv,
            color: rgb(0.1, 0.1, 0.8),
          });
        });
      });

      const mPDF = await pdfDoc.save();
      const fd = new FormData();
      fd.append("file", new Blob([mPDF], { type: "application/pdf" }), file.name);
      const uploadRes = await axios.post("docs/upload", fd);
      const docId = uploadRes.data._id;

      await axios.post("/signatures", {
        documentId: docId,
        signatures: signatures.map(({ page, x, y }) => ({ page, x, y })),
      });

      alert("Signed PDF saved!");
      onSave?.();
    } catch (err) {
      console.error(err);
      alert("Save failed: " + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Signature Input & Font Selection */}
      <div className="my-4">
        <label className="font-semibold">Signature text</label>
        <input
          value={signatureText}
          onChange={e => setSignatureText(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        />
        <div className="flex gap-2 flex-wrap">
          {googleFonts.map(f => (
            <button
              key={f.name}
              onClick={() => setSelectedFont(f)}
              className={`px-3 py-1 border rounded ${selectedFont.name === f.name ? "bg-blue-600 text-white" : ""}`}
              style={{ fontFamily: f.name }}
            >
              {signatureText}
            </button>
          ))}
        </div>
      </div>

      {/* Draggable Text */}
      <div
        draggable
        onDragStart={() => {}}
        className="inline-block bg-blue-100 border border-blue-300 rounded px-4 py-2 text-blue-800 cursor-move shadow"
        style={{ fontFamily: selectedFont.name }}
      >
        ✍️ {signatureText}
      </div>

      {/* PDF Viewer & Drop Area */}
      <div className="mt-6 max-h-[80vh] overflow-auto border rounded p-4 bg-white relative">
        <Document file={previewUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
          {Array.from({ length: numPages }, (_, i) => (
            <div
              key={i}
              className="relative mb-6 border rounded p-2 signature-drop"
              onDrop={(e) => { e.preventDefault(); handleDrop(e, i + 1); }}
              onDragOver={e => e.preventDefault()}
              style={{ minHeight: "300px" }}
            >
              <Page pageNumber={i + 1} width={600} />
              {signatures.filter(s => s.page === i + 1).map((sig, idx) => (
                <div
                  key={idx}
                  className="absolute group cursor-move"
                  style={{
                    top: sig.y,
                    left: sig.x,
                    fontFamily: sig.font,
                    fontSize: "22px",
                    color: "#0b3c91",
                    userSelect: "none",
                  }}
                  draggable
                  onDragStart={() => (dragIndex.current = idx)}
                  onDragEnd={(e) => {
                    const rect = e.currentTarget.offsetParent.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    setSignatures(prev => prev.map((s, i) => i === dragIndex.current ? { ...s, x, y } : s));
                    dragIndex.current = null;
                  }}
                >
                  {sig.text}
                  <button
                    onClick={() => setSignatures(prev => prev.filter((_, x) => x !== idx))}
                    className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1 rounded hidden group-hover:block"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ))}
        </Document>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-green-700"
      >
        {saving ? "Saving..." : "Save Signed PDF"}
      </button>
    </div>
  );
}
