import { useEffect, useState } from "react";
import {
  createStaff,
  getUsers,
  updateUserRole,
  updateUserStatus,
} from "../../services/admin.api";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  role: "STAFF",
};

export default function AdminStaff() {
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState(initialForm);

  const fetchStaff = async () => {
    const res = await getUsers();
    setStaff(
      (res.data.data || []).filter((user) =>
        ["ADMIN", "STAFF"].includes(user.role),
      ),
    );
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await createStaff(form);
    setForm(initialForm);
    fetchStaff();
  };

  const handleRoleChange = async (id, role) => {
    await updateUserRole(id, role);
    fetchStaff();
  };

  const handleStatusChange = async (user) => {
    const nextStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    await updateUserStatus(user.id, nextStatus);
    fetchStaff();
  };

  return (
    <div className="grid lg:grid-cols-[360px_1fr] gap-6">
      <section className="bg-white rounded-2xl shadow p-6 h-fit">
        <h1 className="text-2xl font-bold">Create Staff</h1>

        <form onSubmit={handleCreate} className="mt-6 space-y-4">
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full name"
            className="w-full border rounded-xl px-4 py-3"
            required
          />

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border rounded-xl px-4 py-3"
            required
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border rounded-xl px-4 py-3"
            required
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          >
            <option value="STAFF">Staff</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button className="w-full bg-black text-white rounded-xl px-4 py-3">
            Create
          </button>
        </form>
      </section>

      <section className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-bold">Staff Accounts</h2>

        <div className="mt-6 space-y-3">
          {staff.map((user) => (
            <div
              key={user.id}
              className="border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <p className="font-semibold">{user.fullName}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-500">{user.status}</p>
              </div>

              <div className="flex gap-2">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="border rounded-xl px-3 py-2"
                >
                  <option value="STAFF">Staff</option>
                  <option value="ADMIN">Admin</option>
                </select>

                <button
                  onClick={() => handleStatusChange(user)}
                  className="px-4 py-2 rounded-xl border"
                >
                  {user.status === "ACTIVE" ? "Suspend" : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}