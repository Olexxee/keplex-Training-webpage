import { useEffect, useState } from "react";
import {
  getOrganisation,
  updateOrganisation,
} from "../../services/organisation.api";

const initialForm = {
  name: "",
  slug: "",
  email: "",
  phone: "",
  logoUrl: "",
  address: "",
  socialLinks: "",
  settings: "",
};

export default function AdminSettings() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchOrganisation = async () => {
    try {
      const res = await getOrganisation();
      const org = res.data.data;

      setForm({
        name: org.name || "",
        slug: org.slug || "",
        email: org.email || "",
        phone: org.phone || "",
        logoUrl: org.logoUrl || "",
        address: org.address || "",
        socialLinks: org.socialLinks
          ? JSON.stringify(org.socialLinks, null, 2)
          : "",
        settings: org.settings ? JSON.stringify(org.settings, null, 2) : "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganisation();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const parseJsonField = (value, fallback = null) => {
    if (!value?.trim()) return fallback;
    return JSON.parse(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        name: form.name,
        slug: form.slug,
        email: form.email || null,
        phone: form.phone || null,
        logoUrl: form.logoUrl || null,
        address: form.address || null,
        socialLinks: parseJsonField(form.socialLinks),
        settings: parseJsonField(form.settings),
      };

      await updateOrganisation(payload);

      setMessage("Settings updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading settings...</p>;

  return (
    <section className="max-w-3xl bg-white rounded-2xl shadow p-6">
      <h1 className="text-3xl font-bold">Organisation Settings</h1>

      {message && (
        <div className="bg-green-50 text-green-700 rounded-xl p-4 mt-5">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 rounded-xl p-4 mt-5">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Organisation name"
          className="w-full border rounded-xl px-4 py-3"
          required
        />

        <input
          name="slug"
          value={form.slug}
          onChange={handleChange}
          placeholder="organisation-slug"
          className="w-full border rounded-xl px-4 py-3"
          required
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

        <input
          name="logoUrl"
          value={form.logoUrl}
          onChange={handleChange}
          placeholder="Logo URL"
          className="w-full border rounded-xl px-4 py-3"
        />

        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          rows={3}
          className="w-full border rounded-xl px-4 py-3 resize-none"
        />

        <textarea
          name="socialLinks"
          value={form.socialLinks}
          onChange={handleChange}
          placeholder='{"instagram":"https://instagram.com/keplex"}'
          rows={5}
          className="w-full border rounded-xl px-4 py-3 resize-none font-mono text-sm"
        />

        <textarea
          name="settings"
          value={form.settings}
          onChange={handleChange}
          placeholder='{"currency":"NGN","allowGuestCart":true}'
          rows={5}
          className="w-full border rounded-xl px-4 py-3 resize-none font-mono text-sm"
        />

        <button
          type="submit"
          disabled={saving}
          className="bg-black text-white rounded-xl px-6 py-3 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </section>
  );
}
