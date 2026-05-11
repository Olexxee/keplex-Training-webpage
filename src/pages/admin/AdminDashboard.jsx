import { useEffect, useState } from "react";
import { getDashboardOverview } from "../../services/dashboard.api";

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getDashboardOverview();
      setOverview(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  if (error) {
    return <div className="bg-red-50 text-red-600 p-4 rounded-xl">{error}</div>;
  }

  const counts = overview?.counts || {};
  const revenue = overview?.revenue || {};
  const statusCounts = overview?.orders?.statusCounts || {};

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-gray-500 uppercase tracking-wide">
          Admin Dashboard
        </p>
        <h1 className="text-3xl font-bold mt-1">Overview</h1>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Users" value={counts.users || 0} />
        <StatCard label="Categories" value={counts.categories || 0} />
        <StatCard label="Items" value={counts.items || 0} />
        <StatCard label="Orders" value={counts.orders || 0} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold">Revenue</h2>

          <div className="mt-5">
            <p className="text-4xl font-bold">
              ₦{Number(revenue.totalRevenue || 0).toLocaleString()}
            </p>
            <p className="text-gray-500 mt-1">
              Paid orders: {revenue.paidOrderCount || 0}
            </p>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold">Order Status</h2>

          <div className="grid grid-cols-2 gap-3 mt-5">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="border rounded-xl p-3">
                <p className="text-sm text-gray-500">{status}</p>
                <p className="text-2xl font-bold">{count}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold">Low Stock Items</h2>

        <div className="mt-5 space-y-3">
          {overview?.inventory?.lowStockItems?.length ? (
            overview.inventory.lowStockItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b last:border-b-0 py-3"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.category?.name}</p>
                </div>

                <span className="text-sm font-bold text-red-600">
                  Stock: {item.stock}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No low stock items.</p>
          )}
        </div>
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