import { useEffect, useState } from "react";
import { Trash2, Minus, Plus } from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../../services/cart.api";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

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

  const handleQuantityChange = async (itemId, nextQuantity) => {
    if (nextQuantity < 1) return;

    try {
      setActionLoading(true);

      const res = await updateCartItem(itemId, {
        quantity: nextQuantity,
      });

      setCart(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update cart item");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      setActionLoading(true);

      const res = await removeCartItem(itemId);
      setCart(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove item");
    } finally {
      setActionLoading(false);
    }
  };

  const handleClear = async () => {
    try {
      setActionLoading(true);

      const res = await clearCart();
      setCart(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to clear cart");
    } finally {
      setActionLoading(false);
    }
  };

  const items = cart?.items || [];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="pt-28 px-4 md:px-12 pb-16">
        <section className="max-w-6xl mx-auto">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-500">
                Shopping Cart
              </p>
              <h1 className="text-3xl md:text-5xl font-bold mt-2">
                Your Cart
              </h1>
            </div>

            {items.length > 0 && (
              <button
                onClick={handleClear}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl border text-sm hover:bg-white disabled:opacity-60"
              >
                Clear cart
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 rounded-xl p-4 mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <p>Loading cart...</p>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow">
              <h2 className="text-xl font-semibold">Your cart is empty</h2>
              <p className="text-gray-500 mt-2">
                Browse the catalog and add something.
              </p>

              <Link
                to="/catalog"
                className="inline-block mt-6 bg-black text-white rounded-xl px-6 py-3"
              >
                Go to catalog
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_360px] gap-8">
              <div className="space-y-4">
                {items.map((cartItem) => {
                  const image = cartItem.item?.media?.[0]?.url;

                  return (
                    <article
                      key={cartItem.id}
                      className="bg-white rounded-2xl shadow p-4 flex gap-4"
                    >
                      <div className="w-28 h-28 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                        {image ? (
                          <img
                            src={image}
                            alt={cartItem.item?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="h-full flex items-center justify-center text-xs text-gray-400">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between gap-4">
                          <div>
                            <h2 className="font-semibold text-lg">
                              {cartItem.item?.name}
                            </h2>
                            <p className="text-sm text-gray-500">
                              ₦
                              {Number(
                                cartItem.unitPriceSnapshot,
                              ).toLocaleString()}
                            </p>
                          </div>

                          <button
                            onClick={() => handleRemove(cartItem.itemId)}
                            disabled={actionLoading}
                            className="text-red-500 disabled:opacity-60"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>

                        <div className="mt-5 flex items-center justify-between">
                          <div className="flex items-center border rounded-full">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  cartItem.itemId,
                                  cartItem.quantity - 1,
                                )
                              }
                              disabled={actionLoading}
                              className="p-2 disabled:opacity-60"
                            >
                              <Minus size={16} />
                            </button>

                            <span className="px-4 font-medium">
                              {cartItem.quantity}
                            </span>

                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  cartItem.itemId,
                                  cartItem.quantity + 1,
                                )
                              }
                              disabled={actionLoading}
                              className="p-2 disabled:opacity-60"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          <p className="font-bold">
                            ₦{Number(cartItem.lineTotal).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <aside className="bg-white rounded-2xl shadow p-6 h-fit">
                <h2 className="text-xl font-bold">Order Summary</h2>

                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Total items</span>
                    <span>{cart.totalItems}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₦{Number(cart.subtotal).toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t mt-6 pt-6 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₦{Number(cart.subtotal).toLocaleString()}</span>
                </div>

                <Link
                  to="/checkout"
                  className="block text-center mt-6 bg-black text-white rounded-xl px-6 py-3"
                >
                  Proceed to checkout
                </Link>
              </aside>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}