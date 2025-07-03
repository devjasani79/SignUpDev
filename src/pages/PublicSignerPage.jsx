// src/pages/PublicSignerPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/api";
import SignAndSavePDF from "../components/SignAndSavePDF";

export default function PublicSignerPage() {
  const { token } = useParams();
  const [doc, setDoc] = useState(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDoc = async () => {
    try {
      const res = await axios.get(`public-Sign/${token}`);
      const buffer = Uint8Array.from(atob(res.data.buffer), c => c.charCodeAt(0));
      const blob = new Blob([buffer], { type: "application/pdf" });
      const file = new File([blob], res.data.fileName, { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setDoc(res.data);
      setFile(file);
      setPreviewUrl(url);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Link expired or invalid");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoc();
  }, [token]);

  if (loading) return <div className="p-8 text-gray-500">Loading document...</div>;
  if (error) return <div className="p-8 text-red-600 font-medium">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        ✍️ Sign Document: {doc?.fileName}
      </h1>
      <div className="max-w-4xl mx-auto bg-white p-4 rounded shadow">
        <SignAndSavePDF
          file={file}
          previewUrl={previewUrl}
          docId={doc.documentId}
          publicToken={token} // pass to backend so it knows who signed
          onSave={() => alert("✅ Document signed! You may now close this tab.")}
        />
      </div>
    </div>
  );
}
