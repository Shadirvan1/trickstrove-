import React, { useState } from "react";
import adminapi from "../api/adminapi";
import { useNavigate } from "react-router-dom";

export default function CreateProduct() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
    brand: "",
    description: "",
    activity: "active",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) payload.append(key, value);
      });

      await adminapi.post("product/createproduct/", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/adminpanel/products");
    } catch (err) {
      console.error("Product creation failed", err);
      alert("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-[20vw] w-[80vw] p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Create Product</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow max-w-3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="text-sm font-semibold">Product Name</label>
            <input
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Price</label>
            <input
              name="price"
              type="number"
              required
              value={formData.price}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Quantity</label>
            <input
              name="quantity"
              type="number"
              required
              value={formData.quantity}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Category</label>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Brand</label>
            <input
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Status</label>
            <select
              name="activity"
              value={formData.activity}
              onChange={handleChange}
              className="input"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm font-semibold">Description</label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div className="mt-4">
          <label className="text-sm font-semibold">Product Image</label>
          <input type="file" accept="image/*" onChange={handleImage} />
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-2 w-40 h-40 object-cover rounded"
            />
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Creating..." : "Create Product"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>

      
    </div>
  );
}
