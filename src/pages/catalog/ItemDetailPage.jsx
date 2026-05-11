import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Minus, Plus, ShoppingCart } from "lucide-react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getItemById } from "../../services/item.api";
import { addCartItem } from "../../services/cart.api";

export default function ItemDetailPage() {
  const { itemId } = useParams();

  const [item, setItem] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchItem = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getItemById(itemId);
      const itemData = res.data.data;

      setItem(itemData);
      setSelectedImage(itemData.media?.[0]?.url || null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load item");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, [itemId]);

  const handleQuantityChange = (nextQuantity) => {
    if (nextQuantity < 1) return;

    if (item?.itemType === "PRODUCT" && nextQuantity > item.stock) {
      return;
    }

    setQuantity(nextQuantity);
  };

  const handleAddToCart = async () => {
    try {
      setCartLoading(true);

      await addCartItem({
        itemId: item.id,
        quantity,
      });

      alert("Item added to cart");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add item to cart");
    } finally {
      setCartLoading(false);
    }
  };

  const isOutOfStock = item?.itemType === "PRODUCT" && item?.stock <= 0;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="pt-28 px-4 md:px-12 pb-16">
        <section className="max-w-6xl mx-auto">
          <Link
            to="/catalog"
            className="text-sm text-gray-500 hover:text-black"
          >
            ← Back to catalog
          </Link>

          {error && (
            <div className="bg-red-50 text-red-600 rounded-xl p-4 mt-6">
              {error}
            </div>
          )}

          {loading ? (
            <p className="mt-8">Loading item...</p>
          ) : !item ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow mt-8">
              <h2 className="text-xl font-semibold">Item not found</h2>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8 mt-8">
              <section>
                <div className="bg-white rounded-2xl shadow overflow-hidden">
                  <div className="h-[420px] bg-gray-100">
                    {selectedImage ? (
                      <img
                        src={selectedImage}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                </div>

                {item.media?.length > 1 && (
                  <div className="grid grid-cols-5 gap-3 mt-4">
                    {item.media.map((media) => (
                      <button
                        key={media.id}
                        onClick={() => setSelectedImage(media.url)}
                        className={`h-20 rounded-xl overflow-hidden border ${
                          selectedImage === media.url
                            ? "border-black"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={media.url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </section>

              <section className="bg-white rounded-2xl shadow p-6 h-fit">
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  {item.category?.name} / {item.itemType}
                </p>

                <h1 className="text-3xl md:text-5xl font-bold mt-3">
                  {item.name}
                </h1>

                <div className="flex items-center gap-3 mt-5">
                  <p className="text-3xl font-bold">
                    ₦{Number(item.price).toLocaleString()}
                  </p>

                  {item.compareAtPrice && (
                    <p className="text-gray-400 line-through">
                      ₦{Number(item.compareAtPrice).toLocaleString()}
                    </p>
                  )}
                </div>

                <p className="text-gray-600 mt-5 leading-relaxed">
                  {item.description || "No description provided."}
                </p>

                <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-500">Status</p>
                    <p className="font-semibold">{item.status}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-500">Stock</p>
                    <p className="font-semibold">
                      {item.itemType === "PRODUCT" ? item.stock : "Available"}
                    </p>
                  </div>
                </div>

                {item.metadata && (
                  <div className="mt-6 bg-gray-50 rounded-xl p-4">
                    <p className="font-semibold mb-3">Details</p>

                    <div className="space-y-2 text-sm">
                      {Object.entries(item.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between gap-4">
                          <span className="text-gray-500">{key}</span>
                          <span className="font-medium">
                            {typeof value === "object"
                              ? JSON.stringify(value)
                              : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex items-center gap-4">
                  <div className="flex items-center border rounded-full">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="p-3"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="px-5 font-semibold">{quantity}</span>

                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="p-3"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={
                      cartLoading || isOutOfStock || item.status !== "ACTIVE"
                    }
                    className="flex-1 bg-black text-white rounded-xl px-6 py-3 flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <ShoppingCart size={18} />
                    {isOutOfStock
                      ? "Out of stock"
                      : cartLoading
                        ? "Adding..."
                        : "Add to cart"}
                  </button>
                </div>
              </section>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
