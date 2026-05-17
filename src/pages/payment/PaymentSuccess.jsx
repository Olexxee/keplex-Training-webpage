import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { verifyRegistrationPayment } from "../../services/registration.api";

export default function PaymentSuccess() {
  const location = useLocation();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your payment...");
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search);
      const reference = params.get("reference");

      if (!reference) {
        setStatus("error");
        setMessage("Missing payment reference.");
        return;
      }

      try {
        const res = await verifyRegistrationPayment(reference);

        setRegistration(res.data?.data || null);
        setStatus("success");
        setMessage(
          "Your registration has been confirmed. Check your email for the next step.",
        );
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "Unable to verify payment. Please contact support.",
        );
      }
    };

    verifyPayment();
  }, [location.search]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <section className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 text-center">
        {status === "loading" && (
          <Loader2 className="w-16 h-16 mx-auto animate-spin text-gray-700" />
        )}

        {status === "success" && (
          <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
        )}

        {status === "error" && (
          <XCircle className="w-16 h-16 mx-auto text-red-600" />
        )}

        <h1 className="text-3xl font-extrabold mt-6">
          {status === "success"
            ? "Payment Successful"
            : status === "error"
              ? "Verification Failed"
              : "Please Wait"}
        </h1>

        <p className="text-gray-500 mt-3">{message}</p>

        {registration && (
          <div className="mt-6 bg-gray-50 rounded-2xl p-4 text-left text-sm">
            <p>
              <strong>Name:</strong> {registration.fullName}
            </p>
            <p>
              <strong>Email:</strong> {registration.email}
            </p>
            <p>
              <strong>Status:</strong> {registration.status}
            </p>
          </div>
        )}

        <Link
          to="/"
          className="inline-flex mt-8 bg-black text-white px-6 py-3 rounded-xl font-semibold"
        >
          Back to Home
        </Link>
      </section>
    </main>
  );
}
