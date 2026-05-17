import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

// Marketing components
import Hero from "./components/Hero";
import Features from "./components/Features";
import VideoIntro from "./components/VideoIntro";
import About from "./components/About";
import Registration from "./components/Register";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import TestimonialsSection from "./components/TestimonialsSection";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminRegistrations from "./pages/admin/AdminRegistrations";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminAuditLogs from "./pages/admin/AdminAuditLogs";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminStaff from "./pages/admin/AdminStaff";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminItems from "./pages/admin/AdminItems";

// Layouts & auth
import AdminLayout from "./layouts/AdminLayout";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import { AuthProvider } from "./context/AuthContext";

// Commerce pages
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import CatalogPage from "./pages/catalog/CatalogPage";
import ItemDetailPage from "./pages/catalog/ItemDetailPage";
import CartPage from "./pages/cart/CartPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import MyOrdersPage from "./pages/orders/MyOrdersPage";
import OrderDetailPage from "./pages/orders/OrderDetailPage";
import PaymentCallbackPage from "./pages/payment/PaymentCallbackPage";

// ---------------------------------------------------------------------------
// Layouts
// ---------------------------------------------------------------------------

/**
 * MarketingLayout — full landing page with marketing navbar + footer.
 * Only used for the "/" route.
 */
function MarketingLayout() {
  return (
    <div className="w-full min-h-screen font-sans text-gray-900">
      <Navbar />
      <Hero />
      <About />
      <Features />
      <VideoIntro />
      <Registration />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}

/**
 * CommerceLayout — shared shell for all storefront routes.
 * Swap <Navbar /> here for a slimmer storefront-specific nav when ready
 * (e.g. <StorefrontNavbar /> with a cart icon / user menu).
 */
function CommerceLayout() {
  return (
    <div className="w-full min-h-screen font-sans text-gray-900">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ── Marketing ─────────────────────────────────────────────── */}
          <Route path="/" element={<MarketingLayout />} />

          {/* ── Commerce ──────────────────────────────────────────────── */}
          <Route element={<CommerceLayout />}>
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/catalog/:itemId" element={<ItemDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<MyOrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/payment/callback" element={<PaymentCallbackPage />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
          </Route>

          {/* ── Admin auth (no layout) ─────────────────────────────────── */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ── Admin dashboard ───────────────────────────────────────── */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="registrations" element={<AdminRegistrations />} />
            <Route path="items" element={<AdminItems />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="staff" element={<AdminStaff />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="audit-logs" element={<AdminAuditLogs />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
