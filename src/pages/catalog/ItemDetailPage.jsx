import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Minus, Plus, ShoppingCart, CalendarCheck, Package, Wrench, Clock, MapPin } from "lucide-react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getItemById } from "../../services/item.api";
import { addCartItem } from "../../services/cart.api";

// Friendly label map for metadata keys
const META_LABELS = {
  duration: { label: "Duration", icon: Clock },
  location: { label: "Location", icon: MapPin },
  sessions: { label: "Sessions", icon: CalendarCheck },
};

export default function ItemDetailPage() {
  const { itemId } = useParams();

  const [item, setItem] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [bookingToast, setBookingToast] = useState(false);
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

  useEffect(() => { fetchItem(); }, [itemId]);

  const isService = item?.itemType === "SERVICE";
  const isProduct = item?.itemType === "PRODUCT";
  const isOutOfStock = isProduct && item?.stock <= 0;

  const handleQuantityChange = (next) => {
    if (next < 1) return;
    if (isProduct && next > item.stock) return;
    setQuantity(next);
  };

  const handleAddToCart = async () => {
    try {
      setCartLoading(true);
      await addCartItem({ itemId: item.id, quantity });
      alert("Item added to cart");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add item to cart");
    } finally {
      setCartLoading(false);
    }
  };

  const handleBookNow = () => {
    // Placeholder — wire to booking route or modal later
    setBookingToast(true);
    setTimeout(() => setBookingToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="pt-28 px-4 md:px-12 pb-16">
        <section className="max-w-6xl mx-auto">
          <Link to="/catalog" className="text-sm text-gray-500 hover:text-black transition-colors">
            ← Back to catalog
          </Link>

          {error && (
            <div className="bg-red-50 text-red-600 rounded-xl p-4 mt-6 text-sm">
              {error}
            </div>
          )}

          {/* Booking toast */}
          {bookingToast && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-5 py-3 rounded-full shadow-lg z-50 flex items-center gap-2">
              <CalendarCheck size={16} />
              Contact us to book this service
            </div>
          )}

          {loading ? (
            <p className="mt-8 text-sm text-gray-500">Loading item...</p>
          ) : !item ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100 mt-8">
              <h2 className="text-xl font-semibold">Item not found</h2>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8 mt-8">

              {/* ── Images ── */}
              <section>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="h-[420px] bg-gray-100">
                    {selectedImage ? (
                      <img
                        src={selectedImage}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-3">
                        {isService ? <Wrench size={40} /> : <Package size={40} />}
                        <span className="text-sm">No image</span>
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
                        className={`h-20 rounded-xl overflow-hidden border-2 transition-colors ${
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

              {/* ── Details ── */}
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">

                {/* Type + category breadcrumb */}
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      isService
                        ? "bg-violet-50 text-violet-700 border-violet-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}
                  >
                    {isService ? <Wrench size={11} /> : <Package size={11} />}
                    {isService ? "Service" : "Product"}
                  </span>
                  <span className="text-sm text-gray-400">{item.category?.name}</span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mt-3 leading-tight">
                  {item.name}
                </h1>

                {/* Price */}
                <div className="flex items-center gap-3 mt-5">
                  <p className="text-3xl font-bold">
                    ₦{Number(item.price).toLocaleString()}
                  </p>
                  {/* Compare price — products only */}
                  {isProduct && item.compareAtPrice && (
                    <p className="text-gray-400 line-through text-lg">
                      ₦{Number(item.compareAtPrice).toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Description — label differs per type */}
                <div className="mt-5">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    {isService ? "What to expect" : "Description"}
                  </p>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {item.description || "No description provided."}
                  </p>
                </div>

                {/* Info cards */}
                <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-500 text-xs mb-1">Status</p>
                    <p className="font-semibold capitalize">{item.status.toLowerCase()}</p>
                  </div>

                  {/* Stock card — different for service */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    {isService ? (
                      <>
                        <p className="text-gray-500 text-xs mb-1">Availability</p>
                        <p className="font-semibold text-emerald-600">Available</p>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-500 text-xs mb-1">Stock</p>
                        <p className={`font-semibold ${item.stock === 0 ? "text-red-500" : ""}`}>
                          {item.stock === 0 ? "Out of stock" : item.stock}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Metadata */}
                {item.metadata && (
                  <div className="mt-4 bg-gray-50 rounded-xl p-4">
                    <p className="font-semibold text-sm mb-3">Details</p>
                    <div className="space-y-2 text-sm">
                      {Object.entries(item.metadata).map(([key, value]) => {
                        const meta = META_LABELS[key];
                        const Icon = meta?.icon;
                        return (
                          <div key={key} className="flex items-center justify-between gap-4">
                            <span className="text-gray-500 flex items-center gap-1.5">
                              {Icon && <Icon size={13} />}
                              {meta?.label || key}
                            </span>
                            <span className="font-medium">
                              {typeof value === "object" ? JSON.stringify(value) : String(value)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="mt-6">
                  {isService ? (
                    // SERVICE CTA — Book Now
                    <button
                      onClick={handleBookNow}
                      disabled={item.status !== "ACTIVE"}
                      className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6 py-3.5 flex items-center justify-center gap-2 font-semibold disabled:opacity-60 transition-colors"
                    >
                      <CalendarCheck size={18} />
                      Book Now
                    </button>
                  ) : (
                    // PRODUCT CTA — Quantity + Add to Cart
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-200 rounded-full">
                        <button
                          onClick={() => handleQuantityChange(quantity - 1)}
                          className="p-3 hover:bg-gray-50 rounded-full transition-colors"
                        >
                          <Minus size={15} />
                        </button>
                        <span className="px-4 font-semibold text-sm">{quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(quantity + 1)}
                          className="p-3 hover:bg-gray-50 rounded-full transition-colors"
                        >
                          <Plus size={15} />
                        </button>
                      </div>

                      <button
                        onClick={handleAddToCart}
                        disabled={cartLoading || isOutOfStock || item.status !== "ACTIVE"}
                        className="flex-1 bg-black hover:bg-gray-800 text-white rounded-xl px-6 py-3.5 flex items-center justify-center gap-2 font-semibold disabled:opacity-60 transition-colors"
                      >
                        <ShoppingCart size={18} />
                        {isOutOfStock ? "Out of stock" : cartLoading ? "Adding..." : "Add to cart"}
                      </button>
                    </div>
                  )}
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