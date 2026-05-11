import { useEffect, useState } from "react";
import { getAuditLogs } from "../../services/audit.api";

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getAuditLogs();
      setLogs(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) return <p>Loading audit logs...</p>;

  return (
    <section className="bg-white rounded-2xl shadow p-6">
      <div>
        <p className="text-sm text-gray-500 uppercase tracking-wide">
          Admin Security
        </p>
        <h1 className="text-3xl font-bold mt-1">Audit Logs</h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 rounded-xl p-4 mt-5">
          {error}
        </div>
      )}

      <div className="mt-6 overflow-x-auto">
        {logs.length === 0 ? (
          <p className="text-gray-500">No audit logs yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-3">Action</th>
                <th className="py-3">Entity</th>
                <th className="py-3">Actor</th>
                <th className="py-3">Metadata</th>
                <th className="py-3">Date</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b last:border-b-0 align-top">
                  <td className="py-4 font-medium">{log.action}</td>

                  <td className="py-4">
                    <p>{log.entity}</p>
                    <p className="text-xs text-gray-500">{log.entityId}</p>
                  </td>

                  <td className="py-4">
                    {log.user ? (
                      <>
                        <p className="font-medium">{log.user.fullName}</p>
                        <p className="text-xs text-gray-500">
                          {log.user.email}
                        </p>
                        <p className="text-xs text-gray-500">{log.user.role}</p>
                      </>
                    ) : (
                      <span className="text-gray-500">System</span>
                    )}
                  </td>

                  <td className="py-4">
                    <pre className="bg-gray-50 rounded-xl p-3 text-xs overflow-auto max-w-xs">
                      {JSON.stringify(log.metadata || {}, null, 2)}
                    </pre>
                  </td>

                  <td className="py-4">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
