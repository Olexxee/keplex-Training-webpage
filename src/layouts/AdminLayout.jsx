import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  ["Dashboard", "/admin/dashboard"],
  ["Categories", "/admin/categories"],
  ["Items", "/admin/items"],
  ["Orders", "/admin/orders"],
  ["Customers", "/admin/customers"],
  ["Staff", "/admin/staff"],
  ["Settings", "/admin/settings"],
  ["Audit Logs", "/admin/audit-logs"],
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-white border-r p-5 hidden md:block">
        <h1 className="text-xl font-bold mb-6">Keplex Admin</h1>

        <nav className="space-y-2">
          {navItems.map(([label, href]) => (
            <Link
              key={href}
              to={href}
              className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-sm"
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <section className="flex-1">
        <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
          <div>
            <p className="font-medium">{user?.fullName}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-black text-white text-sm"
          >
            Logout
          </button>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </section>
    </div>
  );
}