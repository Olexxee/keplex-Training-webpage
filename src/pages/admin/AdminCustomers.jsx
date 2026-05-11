import { useEffect, useState } from "react";
import { getUsers, updateUserStatus } from "../../services/admin.api";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    const res = await getUsers({ role: "CUSTOMER" });
    setCustomers(res.data.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const toggleStatus = async (user) => {
    const nextStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    await updateUserStatus(user.id, nextStatus);
    fetchCustomers();
  };

  if (loading) return <p>Loading customers...</p>;

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h1 className="text-3xl font-bold">Customers</h1>

      <div className="mt-6 space-y-3">
        {customers.map((user) => (
          <div
            key={user.id}
            className="border rounded-xl p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{user.fullName}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-500">{user.phone}</p>
            </div>

            <button
              onClick={() => toggleStatus(user)}
              className="px-4 py-2 rounded-xl border"
            >
              {user.status === "ACTIVE" ? "Suspend" : "Activate"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}