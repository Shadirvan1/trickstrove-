import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminapi from "../../api/adminapi";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState("");

  const [data, setData] = useState({
    id: "",
    name: "",
    image: null,
    brand: "",
    category: "",
    price: "",
    description: "",
    quantity: 1,
    activity: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await adminapi.get(`product/products/${id}/`);
        setData({ ...res.data, image: null });
        setPreview(res.data.image);
      } catch (error) {
        console.error("Product not found", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("brand", data.brand);
      formData.append("category", data.category);
      formData.append("price", String(data.price));
      formData.append("quantity", String(data.quantity));
      formData.append("description", data.description);
      formData.append("activity", data.activity);

      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      await adminapi.patch(`product/products/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Product updated successfully!");
      navigate("/adminpanel/products");
    } catch (error) {
      console.error(error.response?.data || error);
      alert("Failed to update product");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-600">
        Loading product...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 p-6">

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-800">
          Edit Product
        </h2>

        <Input label="ID" value={data.id} disabled />
        <Input label="Name" value={data.name} onChange={(v) => setData({ ...data, name: v })} />

        {/* IMAGE */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Product Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setData({ ...data, image: file });
              setPreview(URL.createObjectURL(file));
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <Input label="Brand" value={data.brand} onChange={(v) => setData({ ...data, brand: v })} />
        <Input label="Category" value={data.category} onChange={(v) => setData({ ...data, category: v })} />

        <Input
          label="Price"
          type="number"
          value={data.price}
          onChange={(v) => setData({ ...data, price: v })}
        />

        <Textarea
          label="Description"
          value={data.description}
          onChange={(v) => setData({ ...data, description: v })}
        />

        <Input
          label="Quantity"
          type="number"
          value={data.quantity}
          onChange={(v) => setData({ ...data, quantity: v })}
        />

        {/* ACTIVITY */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Activity Status
          </label>
          <select
            value={data.activity}
            onChange={(e) => setData({ ...data, activity: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* PREVIEW */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Live Preview
        </h2>

        {preview && (
          <img
            src={preview}
            alt={data.name}
            className="h-56 w-full object-cover rounded-xl mb-4"
          />
        )}

        <div className="space-y-1 text-gray-700">
          <p><span className="font-medium">Name:</span> {data.name}</p>
          <p><span className="font-medium">Brand:</span> {data.brand}</p>
          <p><span className="font-medium">Category:</span> {data.category}</p>
          <p><span className="font-medium">Price:</span> ₹{data.price}</p>
          <p><span className="font-medium">Quantity:</span> {data.quantity}</p>
          <p><span className="font-medium">Status:</span> {data.activity}</p>
          <p className="pt-2 text-sm text-gray-600">{data.description}</p>
        </div>
      </div>
    </div>
  );
}

/* REUSABLE INPUT */
function Input({ label, value, onChange, type = "text", disabled = false }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
      />
    </div>
  );
}

/* TEXTAREA */
function Textarea({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <textarea
        rows="4"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
