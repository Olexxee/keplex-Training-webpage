import { useEffect, useState } from "react";
import {
  getRegistrations,
  getRegistrationStats,
  updateRegistrationStatus,
} from "../../services/registration.api";

const STATUS_OPTIONS = ["", "PENDING", "PAID", "CANCELLED", "EXPIRED"];

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState(null);
  const [meta, setMeta] = useState(null);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: "",
    status: "",
  });

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      setError("");

      const [listRes, statsRes] = await Promise.all([
        getRegistrations(filters),
        getRegistrationStats(),
      ]);

      setRegistrations(listRes.data.data || []);
      setMeta(listRes.data.meta || null);
      setStats(statsRes.data.data || null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [filters.page, filters.status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, page: 1 }));
    fetchRegistrations();
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      setUpdatingId(id);
      await updateRegistrationStatus(id, { status });
      await fetchRegistrations();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p>Loading registrations...</p>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide">Admin</p>
          <h1 className="text-3xl font-bold mt-1">Training Registrations</h1>
          <p className="text-gray-500 mt-2">
            Manage paid and pending training registrations.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl">{error}</div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total" value={stats?.total || 0} />
        <StatCard label="Paid" value={stats?.paid || 0} />
        <StatCard label="Pending" value={stats?.pending || 0} />
        <StatCard label="Cancelled" value={stats?.cancelled || 0} />
        <StatCard label="Expired" value={stats?.expired || 0} />
      </div>

      <section className="bg-white rounded-2xl shadow p-5">
        <form
          onSubmit={handleSearchSubmit}
          className="grid md:grid-cols-[1fr_220px_auto] gap-3"
        >
          <input
            type="text"
            placeholder="Search name, email, phone or reference..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                search: e.target.value,
              }))
            }
            className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
          />

          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                page: 1,
                status: e.target.value,
              }))
            }
            className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status || "All statuses"}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-black text-white rounded-xl px-6 py-3 font-semibold"
          >
            Search
          </button>
        </form>
      </section>

      <section className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Reference</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {registrations.length ? (
                registrations.map((registration) => (
                  <tr
                    key={registration.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <p className="font-semibold">{registration.fullName}</p>
                      <p className="text-xs text-gray-500">
                        ID: {registration.id}
                      </p>
                    </td>

                    <td className="p-4">
                      <p>{registration.email}</p>
                      <p className="text-gray-500">{registration.phone}</p>
                    </td>

                    <td className="p-4 font-semibold">
                      ₦{Number(registration.amount || 0).toLocaleString()}
                    </td>

                    <td className="p-4">
                      <StatusBadge status={registration.status} />
                    </td>

                    <td className="p-4">
                      <span className="text-xs break-all text-gray-600">
                        {registration.paymentRef || "—"}
                      </span>
                    </td>

                    <td className="p-4 text-gray-600">
                      {formatDate(registration.createdAt)}
                    </td>

                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        {registration.status !== "PAID" && (
                          <>
                            <button
                              disabled={updatingId === registration.id}
                              onClick={() =>
                                handleStatusUpdate(registration.id, "CANCELLED")
                              }
                              className="px-3 py-2 rounded-lg border text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              Cancel
                            </button>

                            <button
                              disabled={updatingId === registration.id}
                              onClick={() =>
                                handleStatusUpdate(registration.id, "EXPIRED")
                              }
                              className="px-3 py-2 rounded-lg border text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                              Expire
                            </button>
                          </>
                        )}

                        {registration.status === "PAID" && (
                          <span className="text-gray-400">Locked</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    No registrations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {meta && (
          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-gray-500">
              Page {meta.page} of {meta.totalPages || 1} · {meta.total} total
            </p>

            <div className="flex gap-2">
              <button
                disabled={meta.page <= 1}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: prev.page - 1,
                  }))
                }
                className="px-4 py-2 border rounded-lg disabled:opacity-40"
              >
                Previous
              </button>

              <button
                disabled={meta.page >= meta.totalPages}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: prev.page + 1,
                  }))
                }
                className="px-4 py-2 border rounded-lg disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    PAID: "bg-green-50 text-green-700 border-green-200",
    PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
    EXPIRED: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full border text-xs font-bold ${
        styles[status] || "bg-gray-100 text-gray-700 border-gray-200"
      }`}
    >
      {status}
    </span>
  );
}

function formatDate(value) {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
