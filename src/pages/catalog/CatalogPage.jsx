import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";

import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import { getCategories } from "../../services/category.api";
import { getItems } from "../../services/item.api";
import { addCartItem } from "../../services/cart.api";

export default function CatalogPage() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
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
          ...(search && { search }),
        }),
      ]);

      setCategories(categoryRes.data.data || []);
      setItems(itemRes.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load catalog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, [selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCatalog();
  };

  const handleAddToCart = async (itemId) => {
    try {
      setCartLoadingId(itemId);

      await addCartItem({
        itemId,
        quantity: 1,
      });

      alert("Item added to cart");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add item to cart");
    } finally {
      setCartLoadingId(null);
    }
  };

  const getPrimaryImage = (item) => {
    return item.media?.[0]?.url || null;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="pt-28 px-4 md:px-12 pb-16">
        <section className="max-w-7xl mx-auto">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-wide text-gray-500">
              Keplex Catalog
            </p>
            <h1 className="text-3xl md:text-5xl font-bold mt-2">
              Browse our products and services
            </h1>
          </div>

          <form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl shadow p-4 mb-8 flex flex-col md:flex-row gap-3"
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items..."
              className="flex-1 border rounded-xl px-4 py-3"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded-xl px-4 py-3"
            >
              <option value="">All categories</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="bg-black text-white rounded-xl px-6 py-3"
            >
              Search
            </button>
          </form>

          {error && (
            <div className="bg-red-50 text-red-600 rounded-xl p-4 mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <p>Loading catalog...</p>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow">
              <h2 className="text-xl font-semibold">No items found</h2>
              <p className="text-gray-500 mt-2">
                Try another category or search term.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => {
                const image = getPrimaryImage(item);

                return (
                  <article
                    key={item.id}
                    className="bg-white rounded-2xl shadow overflow-hidden"
                  >
                    <Link
                      to={`/catalog/${item.id}`}
                      className="block h-56 bg-gray-100"
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                          No image
                        </div>
                      )}
                    </Link>

                    <div className="p-4">
                      <p className="text-xs text-gray-500">
                        {item.category?.name}
                      </p>

                      <Link to={`/catalog/${item.id}`}>
                        <h2 className="font-semibold text-lg mt-1 hover:underline">
                          {item.name}
                        </h2>
                      </Link>

                      <p className="text-gray-500 text-sm line-clamp-2 mt-1">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between mt-4">
                        <p className="font-bold">
                          ₦{Number(item.price).toLocaleString()}
                        </p>

                        <button
                          onClick={() => handleAddToCart(item.id)}
                          disabled={cartLoadingId === item.id}
                          className="bg-black text-white rounded-full p-3 disabled:opacity-60"
                        >
                          <ShoppingCart size={18} />
                        </button>
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