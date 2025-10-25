import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import sendEmail from "../utils/EmailJs"; // ✅ use default import
import KeplexImage from "../utils/KeplexImage";
import { User, Mail, Phone } from "lucide-react";

export default function Registration() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // Load Paystack script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // On successful payment
  const handlePaymentSuccess = async (response) => {
    try {
      // 1️⃣ Save user registration in Firestore
      await addDoc(collection(db, "registrations"), {
        ...form,
        amountPaid: 5000,
        transactionId: response.reference,
        createdAt: serverTimestamp(),
      });

      // 2️⃣ Prepare EmailJS template parameters (match your HTML)
      const emailData = {
        name: form.name,
        time: new Date().toLocaleString(),
        message: `🎉 Congratulations ${form.name}! Your payment of ₦5,000 was successful.\n\nYou can now join our Telegram group using this link:\n👉 https://t.me/YourGroupLinkHere`,
      };

      // 3️⃣ Send styled email via EmailJS
      const emailResult = await sendEmail(emailData);

      if (emailResult.success) {
        setStatus("✅ Registration complete! Check your email for the Telegram link.");
      } else {
        setStatus("⚠️ Payment saved but email failed to send.");
      }

      // 4️⃣ Clear form after success
      setForm({ name: "", email: "", phone: "" });
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to save registration or send email: " + err.message);
    }
  };

  // Paystack handler
  const handlePay = () => {
    setLoading(true);

    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: form.email,
      amount: 500000,
      currency: "NGN",
      onSuccess: async (response) => {
        await handlePaymentSuccess(response);
        setLoading(false);
      },
      onCancel: () => {
        setStatus("❌ Payment cancelled.");
        setLoading(false);
      },
    });

    handler.openIframe();
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      setStatus("⚠️ Please fill all fields before payment.");
      return;
    }
    handlePay();
  };

  return (
    <section
      id="registration"
      className="relative w-full min-h-screen flex items-center justify-center"
    >
      {/* Background */}
      <KeplexImage
        name="keplex"
        alt="Registration Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg px-6">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-extrabold text-center text-[color:var(--brand-dark)] mb-8">
            Register for Training
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="relative flex items-center">
              <User className="absolute left-3 text-[color:var(--brand)]" size={20} />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Full Name"
                className="w-full pl-10 border-b-2 border-gray-300 bg-transparent py-3 text-gray-900 placeholder-gray-400 focus:border-[color:var(--brand)] focus:outline-none"
              />
            </div>

            {/* Email */}
            <div className="relative flex items-center">
              <Mail className="absolute left-3 text-[color:var(--accent-dark)]" size={20} />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Email"
                className="w-full pl-10 border-b-2 border-gray-300 bg-transparent py-3 text-gray-900 placeholder-gray-400 focus:border-[color:var(--accent-dark)] focus:outline-none"
              />
            </div>

            {/* Phone */}
            <div className="relative flex items-center">
              <Phone className="absolute left-3 text-[color:var(--aqua)]" size={20} />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="Phone Number"
                className="w-full pl-10 border-b-2 border-gray-300 bg-transparent py-3 text-gray-900 placeholder-gray-400 focus:border-[color:var(--aqua)] focus:outline-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg shadow-md font-semibold text-white transition transform ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[color:var(--brand)] hover:bg-[color:var(--brand-dark)] hover:scale-[1.02] active:scale-95"
              }`}
            >
              {loading ? "Processing..." : "Register & Pay ₦5,000"}
            </button>
          </form>

          {status && (
            <p className="mt-6 text-center text-sm font-medium text-gray-700">
              {status}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
