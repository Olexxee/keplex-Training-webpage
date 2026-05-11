import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { verifyPayment } from "../../services/payment.api";

export default function PaymentCallbackPage() {
  const [searchParams] = useSearchParams();

  const reference = searchParams.get("reference");

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    const runVerification = async () => {
      if (!reference) {
        setStatus("failed");
        setMessage("Missing payment reference.");
        return;
      }

      try {
        const res = await verifyPayment(reference);
        const payment = res.data.data;

        if (payment.status === "SUCCESS") {
          setStatus("success");
          setMessage("Payment successful. Your order has been confirmed.");
          return;
        }

        setStatus("pending");
        setMessage(`Payment status: ${payment.status}`);
      } catch (err) {
        setStatus("failed");
        setMessage(
          err.response?.data?.message || "Payment verification failed.",
        );
      }
    };

    runVerification();
  }, [reference]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="pt-28 px-4 md:px-12 pb-16">
        <section className="max-w-xl mx-auto bg-white rounded-2xl shadow p-8 text-center">
          <p className="text-sm uppercase tracking-wide text-gray-500">
            Payment
          </p>

          <h1 className="text-3xl font-bold mt-2">
            {status === "success"
              ? "Payment Confirmed"
              : status === "verifying"
                ? "Verifying Payment"
                : "Payment Update"}
          </h1>

          <p className="text-gray-600 mt-4">{message}</p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/orders"
              className="bg-black text-white rounded-xl px-6 py-3"
            >
              View orders
            </Link>

            <Link
              to="/catalog"
              className="border rounded-xl px-6 py-3"
            >
              Continue shopping
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}