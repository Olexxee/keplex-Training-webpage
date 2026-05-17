import { useState } from "react";
import { User, Mail, Phone, ShieldCheck } from "lucide-react";
import KeplexImage from "../utils/KeplexImage";
import { initializeRegistrationPayment } from "../services/registration.api";

export default function Registration() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone) {
      setStatus("Please fill all fields before payment.");
      return;
    }

    try {
      setLoading(true);
      setStatus("");

      const res = await initializeRegistrationPayment({
        fullName: form.name,
        email: form.email,
        phone: form.phone,
      });

      const authorizationUrl = res.data?.data?.authorizationUrl;

      if (!authorizationUrl) {
        setStatus("Unable to start payment. Please try again.");
        return;
      }

      window.location.href = authorizationUrl;
    } catch (err) {
      setStatus(
        err.response?.data?.message ||
          "Unable to start payment. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="registration"
      className="relative w-full min-h-screen flex items-center justify-center py-24"
    >
      <KeplexImage
        name="keplex"
        alt="Registration Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-full max-w-6xl px-6 grid lg:grid-cols-2 gap-10 items-center">
        <div className="text-white">
          <p className="uppercase tracking-[0.3em] text-sm text-white/70">
            Keplex Training
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold mt-4 leading-tight">
            Register for the next training cohort.
          </h2>

          <p className="text-white/80 mt-5 text-lg max-w-xl">
            Secure your slot, complete payment, and receive confirmation by
            email after successful verification.
          </p>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <InfoCard label="Fee" value="₦5,000" />
            <InfoCard label="Payment" value="Paystack" />
            <InfoCard label="Status" value="Instant" />
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8">
          <h3 className="text-2xl font-extrabold text-gray-900">
            Register & Pay
          </h3>

          <p className="text-gray-500 mt-2">
            Enter your correct details. Your confirmation will be sent to this
            email.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            <InputField
              icon={<User size={20} />}
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
            />

            <InputField
              icon={<Mail size={20} />}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
            />

            <InputField
              icon={<Phone size={20} />}
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800"
              }`}
            >
              {loading ? "Starting payment..." : "Register & Pay ₦5,000"}
            </button>
          </form>

          <div className="flex items-center gap-2 mt-5 text-sm text-gray-500">
            <ShieldCheck size={18} />
            <span>Secure payment powered by Paystack.</span>
          </div>

          {status && (
            <p className="mt-5 text-sm font-medium text-red-600">{status}</p>
          )}
        </div>
      </div>
    </section>
  );
}

function InputField({ icon, ...props }) {
  return (
    <div className="relative flex items-center">
      <span className="absolute left-4 text-gray-400">{icon}</span>

      <input
        {...props}
        required
        className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
      />
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm">
      <p className="text-white/60 text-sm">{label}</p>
      <p className="text-white font-bold text-xl mt-1">{value}</p>
    </div>
  );
}
