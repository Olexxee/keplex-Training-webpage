import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getCart } from "../../services/cart.api";
import { checkout } from "../../services/order.api";
import { initializePayment } from "../../services/payment.api";

export default function CheckoutPage() {
  const [cart, setCart] = useState(null);
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    notes: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchCart = async () => {
    try {
      setLoading(true);

      const res = await getCart();
      setCart(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const orderRes = await checkout(form);
      const order = orderRes.data.data;

      const paymentRes = await initializePayment(order.id);
      const payment = paymentRes.data.data;

      window.location.href = payment.authorizationUrl;
    } catch (err) {
      setError(err.response?.data?.message || "Checkout failed");
    } finally {
      setSubmitting(false);
    }
  };

  const items = cart?.items || [];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="pt-28 px-4 md:px-12 pb-16">
        <section className="max-w-6xl mx-auto">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-wide text-gray-500">
              Checkout
            </p>
            <h1 className="text-3xl md:text-5xl font-bold mt-2">
              Complete your order
            </h1>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 rounded-xl p-4 mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <p>Loading checkout...</p>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow">
              <h2 className="text-xl font-semibold">Your cart is empty</h2>
              <p className="text-gray-500 mt-2">
                Add items before checkout.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="grid lg:grid-cols-[1fr_360px] gap-8"
            >
              <div className="bg-white rounded-2xl shadow p-6 space-y-4">
                <h2 className="text-xl font-bold">Customer details</h2>

                <input
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  placeholder="Full name"
                  className="w-full border rounded-xl px-4 py-3"
                  required
                />

                <input
                  name="customerEmail"
                  type="email"
                  value={form.customerEmail}
                  onChange={handleChange}
                  placeholder="Email address"
                  className="w-full border rounded-xl px-4 py-3"
                />

                <input
                  name="customerPhone"
                  value={form.customerPhone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className="w-full border rounded-xl px-4 py-3"
                  required
                />

                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Delivery note or extra instruction"
                  rows={4}
                  className="w-full border rounded-xl px-4 py-3 resize-none"
                />
              </div>

              <aside className="bg-white rounded-2xl shadow p-6 h-fit">
                <h2 className="text-xl font-bold">Order summary</h2>

                <div className="mt-5 space-y-4">
                  {items.map((cartItem) => (
                    <div
                      key={cartItem.id}
                      className="flex justify-between gap-3 text-sm"
                    >
                      <div>
                        <p className="font-medium">{cartItem.item?.name}</p>
                        <p className="text-gray-500">
                          Qty: {cartItem.quantity}
                        </p>
                      </div>

                      <p className="font-semibold">
                        ₦{Number(cartItem.lineTotal).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t mt-6 pt-6 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₦{Number(cart.subtotal).toLocaleString()}</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-6 bg-black text-white rounded-xl px-6 py-3 disabled:opacity-60"
                >
                  {submitting ? "Processing..." : "Pay with Paystack"}
                </button>
              </aside>
            </form>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}