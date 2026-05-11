import { useEffect, useState } from "react";
import { createItem, deleteItem, getItems, updateItem } from "../../services/item.api";
import { getCategories } from "../../services/category.api";

const initialForm = {
  categoryId: "",
  name: "",
  slug: "",
  description: "",
  price: "",
  compareAtPrice: "",
  sku: "",
  stock: 0,
  itemType: "PRODUCT",
  status: "DRAFT",
  metadata: "",
};

export default function AdminItems() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [itemsRes, categoriesRes] = await Promise.all([
        getItems(),
        getCategories(),
      ]);

      setItems(itemsRes.data.data || []);
      setCategories(categoriesRes.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const generateSlug = (value) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "name" && !editingId ? { slug: generateSlug(value) } : {}),
    }));
  };

  const handleImagesChange = (e) => {
    setImages(Array.from(e.target.files || []));
  };

  const resetForm = () => {
    setForm(initialForm);
    setImages([]);
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);

    setForm({
      categoryId: item.categoryId || "",
      name: item.name || "",
      slug: item.slug || "",
      description: item.description || "",
      price: item.price || "",
      compareAtPrice: item.compareAtPrice || "",
      sku: item.sku || "",
      stock: item.stock || 0,
      itemType: item.itemType || "PRODUCT",
      status: item.status || "DRAFT",
      metadata: item.metadata ? JSON.stringify(item.metadata, null, 2) : "",
    });

    setImages([]);
  };

  const buildFormData = () => {
    const formData = new FormData();

    formData.append("categoryId", form.categoryId);
    formData.append("name", form.name);
    formData.append("slug", form.slug);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("stock", String(form.stock));
    formData.append("itemType", form.itemType);
    formData.append("status", form.status);

    if (form.compareAtPrice) {
      formData.append("compareAtPrice", form.compareAtPrice);
    }

    if (form.sku) {
      formData.append("sku", form.sku);
    }

    if (form.metadata) {
      formData.append("metadata", form.metadata);
    }

    images.forEach((image) => {
      formData.append("images", image);
    });

    return formData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const formData = buildFormData();

      if (editingId) {
        await updateItem(editingId, formData);
      } else {
        await createItem(formData);
      }

      resetForm();
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save item");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this item?");

    if (!confirmed) return;

    try {
      await deleteItem(id);
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete item");
    }
  };

  return (
    <div className="grid xl:grid-cols-[420px_1fr] gap-6">
      <section className="bg-white rounded-2xl shadow p-6 h-fit">
        <h1 className="text-2xl font-bold">
          {editingId ? "Edit Item" : "Create Item"}
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3 mt-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
            required
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Item name"
            className="w-full border rounded-xl px-4 py-3"
            required
          />

          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder="item-slug"
            className="w-full border rounded-xl px-4 py-3"
            required
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows={3}
            className="w-full border rounded-xl px-4 py-3 resize-none"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="w-full border rounded-xl px-4 py-3"
              required
            />

            <input
              name="compareAtPrice"
              type="number"
              value={form.compareAtPrice}
              onChange={handleChange}
              placeholder="Compare price"
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              name="sku"
              value={form.sku}
              onChange={handleChange}
              placeholder="SKU"
              className="w-full border rounded-xl px-4 py-3"
            />

            <input
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              placeholder="Stock"
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select
              name="itemType"
              value={form.itemType}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            >
              <option value="PRODUCT">Product</option>
              <option value="SERVICE">Service</option>
              <option value="PACKAGE">Package</option>
            </select>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            >
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <textarea
            name="metadata"
            value={form.metadata}
            onChange={handleChange}
            placeholder='Optional metadata JSON, e.g. {"serves":10}'
            rows={3}
            className="w-full border rounded-xl px-4 py-3 resize-none font-mono text-sm"
          />

          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImagesChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          <p className="text-xs text-gray-500">
            Uploading new images while editing will replace old images.
          </p>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-black text-white rounded-xl px-4 py-3 disabled:opacity-60"
            >
              {saving ? "Saving..." : editingId ? "Update" : "Create"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-3 border rounded-xl"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-bold">Items</h2>

        {loading ? (
          <p className="mt-6">Loading items...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500 mt-6">No items yet.</p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-3">Item</th>
                  <th className="py-3">Category</th>
                  <th className="py-3">Price</th>
                  <th className="py-3">Stock</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => {
                  const image = item.media?.[0]?.url;

                  return (
                    <tr key={item.id} className="border-b last:border-b-0">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden">
                            {image ? (
                              <img
                                src={image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : null}
                          </div>

                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-gray-500">{item.slug}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4">{item.category?.name}</td>

                      <td className="py-4">
                        ₦{Number(item.price).toLocaleString()}
                      </td>

                      <td className="py-4">{item.stock}</td>

                      <td className="py-4">
                        <span className="px-3 py-1 rounded-full text-xs bg-gray-100">
                          {item.status}
                        </span>
                      </td>

                      <td className="py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="px-3 py-2 border rounded-lg"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="px-3 py-2 bg-red-50 text-red-600 rounded-lg"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}