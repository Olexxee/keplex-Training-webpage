import { useEffect, useState } from "react";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../services/category.api";

const initialForm = {
  name: "",
  slug: "",
  description: "",
  type: "PRODUCT",
  parentId: "",
  isActive: true,
  sortOrder: 0,
};

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getCategories();
      setCategories(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "name" && !editingId ? { slug: generateSlug(value) } : {}),
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setForm({
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
      type: category.type || "PRODUCT",
      parentId: category.parentId || "",
      isActive: category.isActive,
      sortOrder: category.sortOrder || 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        ...form,
        parentId: form.parentId || null,
        sortOrder: Number(form.sortOrder || 0),
      };

      if (editingId) {
        await updateCategory(editingId, payload);
      } else {
        await createCategory(payload);
      }

      resetForm();
      await fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this category?");

    if (!confirmed) return;

    try {
      await deleteCategory(id);
      await fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="grid lg:grid-cols-[380px_1fr] gap-6">
      <section className="bg-white rounded-2xl shadow p-6 h-fit">
        <h1 className="text-2xl font-bold">
          {editingId ? "Edit Category" : "Create Category"}
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3 mt-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Category name"
            className="w-full border rounded-xl px-4 py-3"
            required
          />

          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder="category-slug"
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

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          >
            <option value="PRODUCT">Product</option>
            <option value="SERVICE">Service</option>
            <option value="CONTENT">Content</option>
          </select>

          <select
            name="parentId"
            value={form.parentId}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          >
            <option value="">No parent category</option>
            {categories
              .filter((category) => category.id !== editingId)
              .map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </select>

          <input
            name="sortOrder"
            type="number"
            value={form.sortOrder}
            onChange={handleChange}
            placeholder="Sort order"
            className="w-full border rounded-xl px-4 py-3"
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              name="isActive"
              type="checkbox"
              checked={form.isActive}
              onChange={handleChange}
            />
            Active
          </label>

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
        <h2 className="text-2xl font-bold">Categories</h2>

        {loading ? (
          <p className="mt-6">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="text-gray-500 mt-6">No categories yet.</p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-3">Name</th>
                  <th className="py-3">Type</th>
                  <th className="py-3">Items</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b last:border-b-0">
                    <td className="py-4">
                      <p className="font-medium">{category.name}</p>
                      <p className="text-gray-500">{category.slug}</p>
                    </td>

                    <td className="py-4">{category.type}</td>

                    <td className="py-4">{category._count?.items || 0}</td>

                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          category.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="px-3 py-2 border rounded-lg"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(category.id)}
                          className="px-3 py-2 bg-red-50 text-red-600 rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}s