import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Search,
  Trash2,
  XCircle,
  Clock3,
  MessageSquareQuote,
} from "lucide-react";

import {
  deleteTestimonial,
  getAdminTestimonials,
  getTestimonialStats,
  updateTestimonialStatus,
} from "../../services/testimonial.api";

const STATUS_OPTIONS = ["ALL", "PENDING", "APPROVED", "REJECTED"];

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);

  const queryParams = useMemo(() => {
    return {
      page,
      limit: 10,
      ...(status !== "ALL" ? { status } : {}),
      ...(search ? { search } : {}),
    };
  }, [page, search, status]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);

      const [listRes, statsRes] = await Promise.all([
        getAdminTestimonials(queryParams),
        getTestimonialStats(),
      ]);

      setItems(listRes.data.data || []);
      setMeta(listRes.data.meta || null);

      setStats(statsRes.data.data || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [queryParams]);

  const handleStatusUpdate = async (id, nextStatus) => {
    try {
      setActionLoading(id);

      await updateTestimonialStatus(id, {
        status: nextStatus,
      });

      await fetchTestimonials();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading("");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this testimonial?");

    if (!confirmed) return;

    try {
      setActionLoading(id);

      await deleteTestimonial(id);

      await fetchTestimonials();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading("");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="uppercase tracking-[0.25em] text-sm text-gray-500">
          Admin
        </p>

        <h1 className="text-4xl font-black mt-2">Testimonials</h1>
      </div>

      <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          label="Total"
          value={stats?.total || 0}
          icon={<MessageSquareQuote size={20} />}
        />

        <StatCard
          label="Pending"
          value={stats?.pending || 0}
          icon={<Clock3 size={20} />}
        />

        <StatCard
          label="Approved"
          value={stats?.approved || 0}
          icon={<CheckCircle2 size={20} />}
        />

        <StatCard
          label="Rejected"
          value={stats?.rejected || 0}
          icon={<XCircle size={20} />}
        />
      </section>

      <section className="bg-white rounded-3xl shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search testimonials..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full border rounded-2xl pl-11 pr-4 py-3"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => {
                  setStatus(option);
                  setPage(1);
                }}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${
                  status === option
                    ? "bg-black text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-4 font-semibold">User</th>

                <th className="pb-4 font-semibold">Message</th>

                <th className="pb-4 font-semibold">Rating</th>

                <th className="pb-4 font-semibold">Status</th>

                <th className="pb-4 font-semibold">Date</th>

                <th className="pb-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500">
                    Loading testimonials...
                  </td>
                </tr>
              ) : items.length ? (
                items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b last:border-b-0 align-top"
                  >
                    <td className="py-5 pr-5">
                      <div>
                        <p className="font-bold">{item.name}</p>

                        {item.role && (
                          <p className="text-sm text-gray-500 mt-1">
                            {item.role}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="py-5 pr-5 max-w-md">
                      <p className="text-sm leading-relaxed text-gray-700 line-clamp-4">
                        {item.message}
                      </p>
                    </td>

                    <td className="py-5 pr-5">
                      <div className="flex gap-1">
                        {Array.from({
                          length: item.rating,
                        }).map((_, index) => (
                          <span key={index}>⭐</span>
                        ))}
                      </div>
                    </td>

                    <td className="py-5 pr-5">
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="py-5 pr-5">
                      <p className="text-sm text-gray-600">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </td>

                    <td className="py-5">
                      <div className="flex flex-wrap gap-2">
                        {item.status !== "APPROVED" && (
                          <button
                            disabled={actionLoading === item.id}
                            onClick={() =>
                              handleStatusUpdate(item.id, "APPROVED")
                            }
                            className="bg-green-100 text-green-700 px-3 py-2 rounded-xl text-sm font-semibold"
                          >
                            Approve
                          </button>
                        )}

                        {item.status !== "REJECTED" && (
                          <button
                            disabled={actionLoading === item.id}
                            onClick={() =>
                              handleStatusUpdate(item.id, "REJECTED")
                            }
                            className="bg-yellow-100 text-yellow-700 px-3 py-2 rounded-xl text-sm font-semibold"
                          >
                            Reject
                          </button>
                        )}

                        <button
                          disabled={actionLoading === item.id}
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-100 text-red-700 px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500">
                    No testimonials found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {meta?.totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <button
              disabled={page <= 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="border px-5 py-3 rounded-xl disabled:opacity-40"
            >
              Previous
            </button>

            <p className="text-sm text-gray-500">
              Page {meta.page} of {meta.totalPages}
            </p>

            <button
              disabled={page >= meta.totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="border px-5 py-3 rounded-xl disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-3xl border shadow-sm p-6">
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-sm">{label}</p>

        <div className="text-gray-400">{icon}</div>
      </div>

      <h3 className="text-4xl font-black mt-5">{value}</h3>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    APPROVED: "bg-green-100 text-green-700",

    REJECTED: "bg-red-100 text-red-700",

    PENDING: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`px-3 py-2 rounded-xl text-xs font-bold ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}
