// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/api";
import { useAuth } from "../context/AuthContext";
import UploadAndPreviewPDF from "../components/UploadAndPreviewPDF";
import SignAndSavePDF from "../components/SignAndSavePDF";
import AuditTrail from "../components/AuditTrail";

export default function Dashboard() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [activeDoc, setActiveDoc] = useState(null);
  const [signingDoc, setSigningDoc] = useState(null);

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareTargetDoc, setShareTargetDoc] = useState(null);
  const [recipientEmail, setRecipientEmail] = useState("");

  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("docs");
      setDocs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching docs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
    fetchDocs();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const openInline = (doc) => {
    setActiveDoc(activeDoc?._id === doc._id ? null : doc);
    setSigningDoc(null);
  };

  const startSigning = async (doc) => {
    try {
      const res = await axios.get(`docs/view/${doc._id}`, { responseType: "blob" });
      const pdfBlob = res.data;
      const pdfFile = new File([pdfBlob], doc.fileName, { type: "application/pdf" });
      const preview = URL.createObjectURL(pdfBlob);
      setSigningDoc({ doc, file: pdfFile, previewUrl: preview });
      setActiveDoc(null);
    } catch (err) {
      console.error("Error loading PDF for signing", err);
      alert("Failed to prepare PDF for signing.");
    }
  };

  const handleShare = (doc) => {
    setShareTargetDoc(doc);
    setRecipientEmail("");
    setShareModalOpen(true);
  };

  const sendShareEmail = async () => {
    if (!recipientEmail || !shareTargetDoc) return;

    try {
      const res = await axios.post("/share", {
        documentId: shareTargetDoc._id,
        recipientEmail,
      });

      alert("Share link sent successfully!");
    } catch (err) {
      console.error("Failed to send share email", err);
      alert(err.response?.data?.message || "Failed to share document");
    } finally {
      setShareModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <header className="bg-blue-800 text-white py-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
          <h1 className="text-2xl font-bold tracking-wide">📄 SignDev Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-md shadow-sm"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-10 px-6 space-y-10">
        {/* Upload section */}
        <section className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">📤 Upload Document</h2>
          <UploadAndPreviewPDF
            onPreview={(f, url) => {
              setFile(f);
              setPreviewUrl(url);
              setSigningDoc(null);
              setActiveDoc(null);
            }}
          />
          {file && previewUrl && (
            <div className="mt-6">
              <SignAndSavePDF
                file={file}
                previewUrl={previewUrl}
                docId={null}
                onSave={() => {
                  setFile(null);
                  setPreviewUrl(null);
                  fetchDocs();
                }}
              />
            </div>
          )}
        </section>

        {/* Signing section */}
        {signingDoc && (
          <section className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                ✍️ Signing: <span className="text-blue-600">{signingDoc.doc.fileName}</span>
              </h2>
              <button
                onClick={() => setSigningDoc(null)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <SignAndSavePDF
              file={signingDoc.file}
              previewUrl={signingDoc.previewUrl}
              docId={signingDoc.doc._id}
              onSave={() => {
                setSigningDoc(null);
                fetchDocs();
              }}
            />
          </section>
        )}

        {/* Document list section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">📚 Saved Documents</h2>
          {loading ? (
            <div className="text-gray-500">Loading documents...</div>
          ) : docs.length === 0 ? (
            <div className="text-gray-400 italic">No documents found.</div>
          ) : (
            <div className="space-y-5">
              {docs.map((doc) => (
                <div key={doc._id} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-lg text-gray-800">{doc.fileName}</h3>
                      <p className="text-sm mt-1">
                        Status:{" "}
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                            doc.status === "signed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {doc.status || "pending"}
                        </span>
                      </p>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => openInline(doc)}
                        className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                      >
                        {activeDoc?._id === doc._id ? "Close View" : "View"}
                      </button>
                      <button
                        onClick={() => startSigning(doc)}
                        className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                      >
                        Sign
                      </button>
                      <button
                        onClick={() => handleShare(doc)}
                        className="text-sm bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded transition"
                      >
                        Send for Signature
                      </button>
                    </div>
                  </div>

                  {activeDoc?._id === doc._id && (
                    <div className="mt-6 border-t pt-4">
                      <iframe
                        src={`${import.meta.env.VITE_API_BASE_URL}docs/view/${doc._id}`}
                        title={doc.fileName}
                        className="w-full h-[500px] border rounded-md"
                      />
                      <div className="mt-4">
                        <AuditTrail documentId={doc._id} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Share Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Send for Signature</h2>
            <input
              type="email"
              placeholder="Recipient's email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShareModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={sendShareEmail}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
