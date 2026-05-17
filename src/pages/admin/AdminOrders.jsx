import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../services/order.api";

const STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "COMPLETED", "CANCELLED"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getAllOrders({
        ...(statusFilter && { status: statusFilter }),
      });

      const raw = res.data.data;
      setOrders(Array.isArray(raw) ? raw : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleStatusChange = async (orderId, status) => {
    try {
      setUpdatingId(orderId);

      await updateOrderStatus(orderId, status);
      await fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide">Orders</p>
          <h1 className="text-3xl font-bold mt-1">Manage Orders</h1>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-xl px-4 py-3 bg-white"
        >
          <option value="">All statuses</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl">{error}</div>
      )}

      <section className="bg-white rounded-2xl shadow p-6">
        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <article key={order.id} className="border rounded-2xl p-4">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Order ID</p>
                    <h2 className="font-semibold">{order.id}</h2>

                    <div className="grid sm:grid-cols-3 gap-4 mt-4 text-sm">
                      <div>
                        <p className="text-gray-500">Customer</p>
                        <p className="font-medium">{order.customerName}</p>
                      </div>

                      <div>
                        <p className="text-gray-500">Phone</p>
                        <p className="font-medium">{order.customerPhone}</p>
                      </div>

                      <div>
                        <p className="text-gray-500">Total</p>
                        <p className="font-medium">
                          ₦{Number(order.totalAmount).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[220px]">
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className="border rounded-xl px-4 py-3"
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    <p className="text-xs text-gray-500">
                      Created: {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t pt-4">
                  <p className="font-medium mb-3">Items</p>

                  <div className="space-y-2">
                    {order.items?.map((orderItem) => (
                      <div
                        key={orderItem.id}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {orderItem.item?.name || "Item"} × {orderItem.quantity}
                        </span>

                        <span>
                          ₦{Number(orderItem.totalPrice).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}