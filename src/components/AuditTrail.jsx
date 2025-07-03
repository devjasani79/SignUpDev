// components/AuditTrail.jsx
import { useEffect, useState } from "react";
import axios from "../api/api";
import { formatDistanceToNow, format } from "date-fns";

const icons = {
  viewed: "👁️",
  signed: "✍️",
  rejected: "❌",
};

const AuditTrail = ({ documentId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAuditLogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`audits/${documentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(data);
    } catch (err) {
      console.error("Failed to fetch audit logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) fetchAuditLogs();
  }, [documentId]);

  return (
    <div className="mt-6 p-4 bg-white border rounded shadow">
      <h3 className="text-lg font-semibold mb-3">🕵️ Audit Trail</h3>
      {loading ? (
        <p className="text-gray-500">Loading audit logs...</p>
      ) : logs.length === 0 ? (
        <p className="text-gray-400 italic">No audit entries found for this document.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {logs.map((log) => {
            const user = log.signer;
            const actionIcon = icons[log.action] || "📝";
            const dateStr = new Date(log.timestamp);
            return (
              <li key={log._id} className="py-3">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{actionIcon}</span>
                    <span className="font-medium capitalize">{log.action}</span>
                    <span className="text-sm text-gray-500">
                      by{" "}
                      <span className="font-semibold text-gray-700">
                        {user?.name || "Unknown"}
                      </span>{" "}
                      <span className="text-gray-400">
                        ({user?.email || "anonymous"})
                      </span>
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(dateStr, { addSuffix: true })}{" "}
                    <span className="text-xs text-gray-400">
                      ({format(dateStr, "PPPpp")})
                    </span>
                  </span>
                </div>

                <div className="text-sm text-gray-600">
                  IP: <code className="bg-gray-100 px-1 rounded">{log.ipAddress || "unknown"}</code>
                </div>

                {log.reason && (
                  <div className="mt-1 text-sm text-red-600">
                    📝 <strong>Rejection Reason:</strong> {log.reason}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AuditTrail;
