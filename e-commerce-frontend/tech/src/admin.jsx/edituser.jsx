import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import adminapi from "../api/adminapi";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    is_active: false,
    is_staff: false,
    is_superuser: false,
    is_verified: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const res = await adminapi.get(`user/users/${id}/`);
      setForm(res.data);
    } catch (err) {
      console.error("Failed to fetch user", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await adminapi.patch(`user/users/${id}/`, form);
      alert("User updated successfully");
      navigate("/adminpanel/userdetails");
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="ml-[20vw] p-6">Loading user...</div>;
  }

  return (
    <div className="ml-[20vw] w-[80vw] p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Edit User</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-6 max-w-xl"
      >
        {/* Username */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />
            Active
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_verified"
              checked={form.is_verified}
              onChange={handleChange}
            />
            Verified
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_staff"
              checked={form.is_staff}
              onChange={handleChange}
            />
            Admin
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_superuser"
              checked={form.is_superuser}
              onChange={handleChange}
            />
            Superuser
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
