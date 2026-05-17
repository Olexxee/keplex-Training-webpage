import { useEffect, useState } from "react";
import { ShoppingCart, CalendarCheck, Package, Wrench } from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getCategories } from "../../services/category.api";
import { getItems } from "../../services/item.api";
import { addCartItem } from "../../services/cart.api";

const TYPE_TABS = [
  { value: "", label: "All" },
  { value: "PRODUCT", label: "Products", icon: Package },
  { value: "SERVICE", label: "Services", icon: Wrench },
];

export default function CatalogPage() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [cartLoadingId, setCartLoadingId] = useState(null);
  const [error, setError] = useState("");

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      setError("");

      const [categoryRes, itemRes] = await Promise.all([
        getCategories(),
        getItems({
          status: "ACTIVE",
          ...(selectedCategory && { categoryId: selectedCategory }),
          ...(selectedType && { itemType: selectedType }),
          ...(search && { search }),
        }),
      ]);

      setCategories(Array.isArray(categoryRes.data.data) ? categoryRes.data.data : []);
      setItems(Array.isArray(itemRes.data.data) ? itemRes.data.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load catalog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, [selectedCategory, selectedType]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCatalog();
  };

  const handleAddToCart = async (itemId) => {
    try {
      setCartLoadingId(itemId);
      await addCartItem({ itemId, quantity: 1 });
      alert("Item added to cart");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add item to cart");
    } finally {
      setCartLoadingId(null);
    }
  };

  const getPrimaryImage = (item) => item.media?.[0]?.url || null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="pt-28 px-4 md:px-12 pb-16">
        <section className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <p className="text-sm uppercase tracking-wide text-gray-500">Catalog</p>
            <h1 className="text-3xl md:text-5xl font-bold mt-2">
              Browse our products & services
            </h1>
          </div>

          {/* Type tabs */}
          <div className="flex gap-2 mb-5">
            {TYPE_TABS.map(({ value, label, icon: Icon }) => {
              const active = selectedType === value;
              return (
                <button
                  key={value}
                  onClick={() => setSelectedType(value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    active
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {Icon && <Icon size={14} />}
                  {label}
                </button>
              );
            })}
          </div>

          {/* Search & Category filter */}
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8 flex flex-col md:flex-row gap-3"
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items..."
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white"
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <button
              type="submit"
              className="bg-black text-white rounded-xl px-6 py-3 text-sm font-medium"
            >
              Search
            </button>
          </form>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-600 rounded-xl p-4 mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Items grid */}
          {loading ? (
            <p className="text-sm text-gray-500">Loading catalog...</p>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold">No items found</h2>
              <p className="text-gray-500 mt-2 text-sm">
                Try another category or search term.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => {
                const image = getPrimaryImage(item);
                const isService = item.itemType === "SERVICE";
                const isLoading = cartLoadingId === item.id;

                return (
                  <article
                    key={item.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Image */}
                    <Link to={`/catalog/${item.id}`} className="block relative h-56 bg-gray-100">
                      {image ? (
                        <img
                          src={image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-300">
                          {isService ? <Wrench size={32} /> : <Package size={32} />}
                        </div>
                      )}

                      {/* Type badge overlaid on image */}
                      <span
                        className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${
                          isService
                            ? "bg-violet-50/90 text-violet-700 border-violet-200"
                            : "bg-blue-50/90 text-blue-700 border-blue-200"
                        }`}
                      >
                        {isService ? <Wrench size={11} /> : <Package size={11} />}
                        {isService ? "Service" : "Product"}
                      </span>
                    </Link>

                    {/* Card body */}
                    <div className="p-4">
                      <p className="text-xs text-gray-400">{item.category?.name}</p>

                      <Link to={`/catalog/${item.id}`}>
                        <h2 className="font-semibold text-base mt-1 hover:underline leading-tight">
                          {item.name}
                        </h2>
                      </Link>

                      <p className="text-gray-500 text-sm line-clamp-2 mt-1">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between mt-4">
                        <div>
                          <p className="font-bold text-gray-900">
                            ₦{Number(item.price).toLocaleString()}
                          </p>
                          {/* Show out-of-stock only for products */}
                          {!isService && item.stock === 0 && (
                            <p className="text-xs text-red-500 mt-0.5">Out of stock</p>
                          )}
                        </div>

                        {isService ? (
                          // SERVICE — navigate to detail
                          <Link
                            to={`/catalog/${item.id}`}
                            className="flex items-center gap-1.5 bg-violet-600 text-white rounded-full px-4 py-2 text-xs font-semibold hover:bg-violet-700 transition-colors"
                          >
                            <CalendarCheck size={14} />
                            Book
                          </Link>
                        ) : (
                          // PRODUCT — add to cart
                          <button
                            onClick={() => handleAddToCart(item.id)}
                            disabled={isLoading || item.stock === 0}
                            className="bg-black text-white rounded-full p-2.5 disabled:opacity-50 hover:bg-gray-800 transition-colors"
                          >
                            <ShoppingCart size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}