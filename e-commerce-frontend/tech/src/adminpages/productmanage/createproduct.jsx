import React, { useState } from "react";
import adminapi from "../../api/adminapi";
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
  <div className="min-h-screen w-full bg-slate-100 px-6 py-8">
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-8 text-3xl font-bold text-slate-800">
        Create Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl bg-white p-8 shadow-lg"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Product Name
            </label>
            <input
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm
                         focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Price
            </label>
            <input
              name="price"
              type="number"
              required
              value={formData.price}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm
                         focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Quantity
            </label>
            <input
              name="quantity"
              type="number"
              required
              value={formData.quantity}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm
                         focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Category
            </label>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm
                         focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Brand
            </label>
            <input
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm
                         focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Status
            </label>
            <select
              name="activity"
              value={formData.activity}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm
                         focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm
                       focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Product Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="block w-full text-sm text-slate-600
                       file:mr-4 file:rounded-lg file:border-0
                       file:bg-blue-50 file:px-4 file:py-2
                       file:text-sm file:font-medium
                       file:text-blue-600 hover:file:bg-blue-100"
          />

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-4 h-40 w-40 rounded-lg object-cover ring-1 ring-slate-200"
            />
          )}
        </div>

        <div className="mt-8 flex gap-4">
          <button
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white
                       hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Product"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg bg-slate-200 px-6 py-2.5 text-sm font-medium text-slate-700
                       hover:bg-slate-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
);

}
