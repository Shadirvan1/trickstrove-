import { useEffect, useState } from "react";
import adminapi from "../api/adminapi";
import { useNavigate } from "react-router-dom";
import Plus from "../pics/plus.png";

export default function AdminProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await adminapi.get("product/products/");
      setProducts(res.data);
      setFiltered(res.data);

      const uniqueBrands = [
        "All",
        ...new Set(res.data.map((p) => p.brand).filter(Boolean)),
      ];
      setBrands(uniqueBrands);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (brand) => {
    if (brand === "All") {
      setFiltered(products);
    } else {
      setFiltered(products.filter((p) => p.brand === brand));
    }
  };

  const toggleProduct = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";

      await adminapi.patch(`product/products/${id}/`, {
        activity: newStatus,
      });

      const updated = products.map((p) =>
        p.id === id ? { ...p, activity: newStatus } : p
      );

      setProducts(updated);
      setFiltered(updated);
    } catch (err) {
      console.error("Failed to toggle product", err);
    }
  };

  if (loading) {
    return <div className="ml-[20vw] p-6">Loading products...</div>;
  }

  return (
    <div className="ml-[20vw] w-[80vw] p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Product Management</h1>

      <div className="flex gap-3 mb-6 flex-wrap">
        {brands.map((b, i) => (
          <button
            key={i}
            onClick={() => handleFilter(b)}
            className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
          >
            {b}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div
          onClick={()=>navigate("/adminpanel/createproduct")}
          className="cursor-pointer border-2 border-dashed rounded-lg flex flex-col items-center justify-center h-64 bg-white hover:bg-gray-100"
        >
          <img src={Plus} alt="Add" className="w-10 mb-2" />
          <p className="font-semibold">Add Product</p>
        </div>

        {filtered.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-lg shadow p-3 flex flex-col"
          >
            <img
              src={p.image}
              alt={p.name}
              className="h-40 object-cover rounded"
            />

            <h3 className="mt-2 font-semibold">{p.name}</h3>
            <p className="text-xs text-gray-500">{p.category}</p>
            <p className="font-bold mt-1">₹{p.price}</p>

            <span
              className={`text-xs mt-1 px-2 py-1 rounded w-fit ${
                p.activity === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {p.activity}
            </span>

            <div className="flex gap-2 mt-auto pt-3">
              <button
                onClick={() => navigate(`/adminpanel/edit/${p.id}`)}
                className="flex-1 text-xs bg-blue-500 text-white rounded py-1 hover:bg-blue-600"
              >
                Edit
              </button>

              <button
                onClick={() => toggleProduct(p.id, p.activity)}
                className={`flex-1 text-xs rounded py-1 text-white ${
                  p.activity === "active"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {p.activity === "active" ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
