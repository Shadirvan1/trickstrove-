import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Payment() {
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address: "",
    pincode: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContinue = async () => {
    if (!form.full_name || !form.address || !form.pincode || !form.phone) {
      alert("Please fill all address fields or click Skip");
      return;
    }

    try {
      await api.post("payment/addresses/", form); 
      alert("Address saved successfully!");
    } catch (err) {
      console.error("Error saving address:", err);
      alert("Failed to save address");
      return;
    }

    navigate("/paymentpage"); 
  };

  return (
    <div className="mt-[12vh] min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Delivery Address</h2>

        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={form.full_name}
          onChange={handleChange}
          className="w-full p-3 mb-3 border rounded focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-3 mb-3 border rounded focus:ring-2 focus:ring-blue-400"
        />

        <textarea
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="w-full p-3 mb-3 border rounded focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={form.pincode}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex justify-between">
          <button
            onClick={() => navigate("/paymentpage")}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Skip
          </button>

          <button
            onClick={handleContinue}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
