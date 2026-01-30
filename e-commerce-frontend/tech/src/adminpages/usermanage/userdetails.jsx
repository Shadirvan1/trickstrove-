import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminapi from "../../api/adminapi";

export default function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
 const user_id = Number(localStorage.getItem("user_id"))
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await adminapi.get("user/users/");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUser = async (userId) => {
    try {
      await adminapi.patch(`user/users/${userId}/togleuser/`);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, is_active: !u.is_active } : u
        )
      );
    } catch (err) {
      console.error("Failed to toggle user", err);
    }
  };

  const getRoleBadge = (user) => {
    if (user.is_superuser) {
      return (
        <span className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-700">
          Superuser
        </span>
      );
    }
    if (user.is_staff) {
      return (
        <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
          Admin
        </span>
      );
    }
    return (
      <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
        User
      </span>
    );
  };

  if (loading) {
    return <div className="ml-[20vw] p-6">Loading users...</div>;
  }

  return (
    <div className="ml-[20vw] w-[80vw] p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        User Management
      </h1>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 border text-left">ID</th>
              <th className="px-4 py-3 border text-left">Username</th>
              <th className="px-4 py-3 border text-left">Email</th>
              <th className="px-4 py-3 border text-left">Role</th>
              <th className="px-4 py-3 border text-left">Verified</th>
              <th className="px-4 py-3 border text-left">Status</th>
              <th className="px-4 py-3 border text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{user.id}</td>
                <td className="px-4 py-2 border">{user.username}</td>
                <td className="px-4 py-2 border">{user.email}</td>

                <td className="px-4 py-2 border">
                  {getRoleBadge(user)}
                </td>

                <td className="px-4 py-2 border">
                  {user.is_verified ? (
                    <span className="text-green-600 font-semibold">
                      Yes
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">
                      No
                    </span>
                  )}
                </td>

                <td className="px-4 py-2 border">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      user.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.is_active ? "Active" : "Blocked"}
                  </span>
                </td>

                <td className="px-4 py-2 border text-center">
                  <div className="flex justify-center gap-2 flex-wrap">

{user.id !== user_id && (
  <>
    <button
      onClick={() => navigate(`/admin/edituser/${user.id}`)}
      className="px-3 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600"
    >
      Edit
    </button>

    <button
      onClick={() => navigate(`order/${user.id}`)}
      className="px-3 py-1 text-xs rounded bg-indigo-500 text-white hover:bg-indigo-600"
    >
      Orders
    </button>
  </>


)}
                    {user.is_superuser ? (
                        <span className="text-gray-400 text-xs px-2 py-1">
                        Protected
                      </span>
                    ) : (
                      <button
                        onClick={() => toggleUser(user.id)}
                        className={`px-3 py-1 rounded text-white text-xs ${
                          user.is_active
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {user.is_active ? "Block" : "Unblock"}
                      </button>
                    )}

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
