import emailjs from "emailjs-com";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/**
 * Sends an email using EmailJS.
 * @param {Object} data - Must match your EmailJS template variables
 * Example: { name, time, message }
 */
const sendEmail = async (data) => {
  try {
    console.log("📨 Sending email...", data);
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      data,
      PUBLIC_KEY
    );
    console.log("✅ Email sent successfully:", result.text);
    return { success: true };
  } catch (error) {
    console.error("❌ Email send failed:", error);
    return { success: false, error };
  }
};

export default sendEmail;
