import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getOrderById } from "../../services/order.api";
import { initializePayment } from "../../services/payment.api";

export default function OrderDetailPage() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getOrderById(id);
      setOrder(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handlePayNow = async () => {
    try {
      setPaymentLoading(true);

      const res = await initializePayment(order.id);
      const payment = res.data.data;

      window.location.href = payment.authorizationUrl;
    } catch (err) {
      alert(err.response?.data?.message || "Failed to initialize payment");
    } finally {
      setPaymentLoading(false);
    }
  };

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
        <section className="max-w-5xl mx-auto">
          <Link to="/orders" className="text-sm text-gray-500 hover:text-black">
            ← Back to orders
          </Link>

          {error && (
            <div className="bg-red-50 text-red-600 rounded-xl p-4 mt-6">
              {error}
            </div>
          )}

          {loading ? (
            <p className="mt-8">Loading order...</p>
          ) : !order ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow mt-8">
              <h2 className="text-xl font-semibold">Order not found</h2>
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              <div className="bg-white rounded-2xl shadow p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-wide text-gray-500">
                      Order Detail
                    </p>
                    <h1 className="text-2xl md:text-4xl font-bold mt-2">
                      {order.id}
                    </h1>
                  </div>

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium w-fit ${getStatusClass(
                      order.status,
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 mt-6 text-sm">
                  <div>
                    <p className="text-gray-500">Customer</p>
                    <p className="font-medium">{order.customerName}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium">{order.customerPhone}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium">
                      {order.customerEmail || "Not provided"}
                    </p>
                  </div>
                </div>

                {order.notes && (
                  <div className="mt-5 bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-500 text-sm">Notes</p>
                    <p className="mt-1">{order.notes}</p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-xl font-bold">Items</h2>

                <div className="mt-5 space-y-4">
                  {order.items?.map((orderItem) => {
                    const image = orderItem.item?.media?.[0]?.url;

                    return (
                      <div
                        key={orderItem.id}
                        className="flex gap-4 border-b last:border-b-0 pb-4 last:pb-0"
                      >
                        <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                          {image ? (
                            <img
                              src={image}
                              alt={orderItem.item?.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="h-full flex items-center justify-center text-xs text-gray-400">
                              No image
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {orderItem.item?.name}
                          </h3>

                          <p className="text-sm text-gray-500">
                            Qty: {orderItem.quantity} × ₦
                            {Number(
                              orderItem.unitPriceSnapshot,
                            ).toLocaleString()}
                          </p>
                        </div>

                        <p className="font-bold">
                          ₦{Number(orderItem.totalPrice).toLocaleString()}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t mt-6 pt-6 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>₦{Number(order.totalAmount).toLocaleString()}</span>
                </div>

                {order.status === "PENDING" && (
                  <button
                    onClick={handlePayNow}
                    disabled={paymentLoading}
                    className="w-full mt-6 bg-black text-white rounded-xl px-6 py-3 disabled:opacity-60"
                  >
                    {paymentLoading ? "Processing..." : "Pay now"}
                  </button>
                )}
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}