import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getMyOrders } from "../../services/order.api";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getMyOrders();
      setOrders(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusClass = (status) => {
    const classes = {
      PENDING: "bg-yellow-100 text-yellow-700",
      CONFIRMED: "bg-green-100 text-green-700",
      PROCESSING: "bg-blue-100 text-blue-700",
      COMPLETED: "bg-black text-white",
      CANCELLED: "bg-red-100 text-red-700",
    };

    return classes[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="pt-28 px-4 md:px-12 pb-16">
        <section className="max-w-6xl mx-auto">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-wide text-gray-500">
              Orders
            </p>
            <h1 className="text-3xl md:text-5xl font-bold mt-2">
              My Orders
            </h1>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 rounded-xl p-4 mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow">
              <h2 className="text-xl font-semibold">No orders yet</h2>
              <p className="text-gray-500 mt-2">
                Your orders will appear here after checkout.
              </p>

              <Link
                to="/catalog"
                className="inline-block mt-6 bg-black text-white rounded-xl px-6 py-3"
              >
                Browse catalog
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <article
                  key={order.id}
                  className="bg-white rounded-2xl shadow p-5"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <h2 className="font-semibold">{order.id}</h2>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                          order.status,
                        )}`}
                      >
                        {order.status}
                      </span>

                      <Link
                        to={`/orders/${order.id}`}
                        className="px-4 py-2 rounded-xl border text-sm hover:bg-gray-50"
                      >
                        View
                      </Link>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4 mt-5 text-sm">
                    <div>
                      <p className="text-gray-500">Customer</p>
                      <p className="font-medium">{order.customerName}</p>
                    </div>

                    <div>
                      <p className="text-gray-500">Total</p>
                      <p className="font-medium">
                        ₦{Number(order.totalAmount).toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">Created</p>
                      <p className="font-medium">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}