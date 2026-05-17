import { useEffect, useState } from "react";
import { Package, Wrench, ImagePlus, X } from "lucide-react";
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

const TYPE_CONFIG = {
  PRODUCT: {
    label: "Product",
    icon: Package,
    color: "bg-blue-50 text-blue-700 border-blue-200",
    badgeDot: "bg-blue-500",
    descriptionLabel: "Description",
    descriptionPlaceholder: "Describe this product...",
    metadataPlaceholder: '{"weight": "2kg", "color": "red", "size": "M"}',
    showStock: true,
    showSku: true,
    showCompareAt: true,
  },
  SERVICE: {
    label: "Service",
    icon: Wrench,
    color: "bg-violet-50 text-violet-700 border-violet-200",
    badgeDot: "bg-violet-500",
    descriptionLabel: "What to expect",
    descriptionPlaceholder: "Describe what the client will receive or experience...",
    metadataPlaceholder: '{"duration": "2hrs", "location": "On-site", "sessions": 3}',
    showStock: false,
    showSku: false,
    showCompareAt: false,
  },
};

const STATUS_STYLES = {
  ACTIVE: "bg-emerald-50 text-emerald-700",
  DRAFT: "bg-gray-100 text-gray-600",
  ARCHIVED: "bg-red-50 text-red-600",
};

function TypeBadge({ type, size = "sm" }) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.PRODUCT;
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 border rounded-full font-medium ${config.color} ${
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm"
      }`}
    >
      <Icon size={size === "sm" ? 11 : 13} />
      {config.label}
    </span>
  );
}

export default function AdminItems() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const config = TYPE_CONFIG[form.itemType] || TYPE_CONFIG.PRODUCT;

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

  useEffect(() => { fetchData(); }, []);

  const generateSlug = (value) =>
    value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

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
    formData.append("status", form.status);

    // Only append itemType on create
    if (!editingId) {
      formData.append("itemType", form.itemType);
    }

    // PRODUCT-only fields
    if (form.itemType === "PRODUCT") {
      formData.append("stock", String(form.stock));
      if (form.compareAtPrice) formData.append("compareAtPrice", form.compareAtPrice);
      if (form.sku) formData.append("sku", form.sku);
    }

    if (form.metadata) formData.append("metadata", form.metadata);
    images.forEach((image) => formData.append("images", image));

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
    if (!window.confirm("Delete this item?")) return;
    try {
      await deleteItem(id);
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete item");
    }
  };

  return (
    <div className="grid xl:grid-cols-[440px_1fr] gap-6">
      {/* ── FORM PANEL ── */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">
            {editingId ? "Edit Item" : "Create Item"}
          </h1>
          {editingId && <TypeBadge type={form.itemType} size="md" />}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3 mt-4 flex items-start gap-2">
            <X size={15} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {/* Item Type — only shown on create */}
          {!editingId && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Item Type
              </p>
              <div className="grid grid-cols-2 gap-3">
                {["PRODUCT", "SERVICE"].map((type) => {
                  const tc = TYPE_CONFIG[type];
                  const Icon = tc.icon;
                  const active = form.itemType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, itemType: type }))}
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        active
                          ? "border-black bg-black text-white"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <Icon size={16} />
                      {tc.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Category */}
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white"
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Name */}
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Item name"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
            required
          />

          {/* Slug */}
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder="item-slug"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono"
            required
          />

          {/* Description — label changes per type */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
              {config.descriptionLabel}
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder={config.descriptionPlaceholder}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 resize-none text-sm"
            />
          </div>

          {/* Price row */}
          <div className={`grid gap-3 ${config.showCompareAt ? "grid-cols-2" : "grid-cols-1"}`}>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                Price (₦)
              </label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
                required
              />
            </div>

            {config.showCompareAt && (
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                  Compare At (₦)
                </label>
                <input
                  name="compareAtPrice"
                  type="number"
                  value={form.compareAtPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
                />
              </div>
            )}
          </div>

          {/* SKU + Stock — PRODUCT only */}
          {config.showSku && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                  SKU
                </label>
                <input
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  placeholder="SKU-001"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                  Stock
                </label>
                <input
                  name="stock"
                  type="number"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
                />
              </div>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white"
            >
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          {/* Metadata */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
              Metadata <span className="normal-case font-normal text-gray-400">(optional JSON)</span>
            </label>
            <textarea
              name="metadata"
              value={form.metadata}
              onChange={handleChange}
              placeholder={config.metadataPlaceholder}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 resize-none font-mono text-xs"
            />
          </div>

          {/* Images */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
              Images
            </label>
            <label className="flex items-center gap-3 border-2 border-dashed border-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:border-gray-300 transition-colors">
              <ImagePlus size={18} className="text-gray-400" />
              <span className="text-sm text-gray-500">
                {images.length > 0
                  ? `${images.length} file${images.length > 1 ? "s" : ""} selected`
                  : "Choose images..."}
              </span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImagesChange}
                className="hidden"
              />
            </label>
            {editingId && (
              <p className="text-xs text-gray-400 mt-1.5">
                Uploading new images will replace existing ones.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-black text-white rounded-xl px-4 py-3 text-sm font-medium disabled:opacity-60 transition-opacity"
            >
              {saving ? "Saving..." : editingId ? "Update Item" : "Create Item"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-3 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* ── TABLE PANEL ── */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900">Items</h2>

        {loading ? (
          <p className="mt-6 text-sm text-gray-500">Loading items...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-400 mt-6 text-sm">No items yet.</p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-100">
                  <th className="pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Item</th>
                  <th className="pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Type</th>
                  <th className="pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Category</th>
                  <th className="pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Price</th>
                  <th className="pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Stock</th>
                  <th className="pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Status</th>
                  <th className="pb-3 text-right font-semibold text-gray-500 text-xs uppercase tracking-wide">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {items.map((item) => {
                  const image = item.media?.[0]?.url;
                  const isService = item.itemType === "SERVICE";

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Item */}
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                            {image ? (
                              <img src={image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                {isService ? <Wrench size={16} /> : <Package size={16} />}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 leading-tight">{item.name}</p>
                            <p className="text-gray-400 text-xs mt-0.5">{item.slug}</p>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-4 pr-4">
                        <TypeBadge type={item.itemType} />
                      </td>

                      {/* Category */}
                      <td className="py-4 pr-4 text-gray-600">{item.category?.name || "—"}</td>

                      {/* Price */}
                      <td className="py-4 pr-4 font-medium">
                        ₦{Number(item.price).toLocaleString()}
                      </td>

                      {/* Stock — meaningful only for PRODUCT */}
                      <td className="py-4 pr-4">
                        {isService ? (
                          <span className="text-gray-400 text-xs italic">N/A</span>
                        ) : item.stock === 0 ? (
                          <span className="text-red-500 font-medium">Out of stock</span>
                        ) : (
                          <span className="text-gray-700">{item.stock}</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 pr-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[item.status] || "bg-gray-100 text-gray-600"}`}>
                          {item.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
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