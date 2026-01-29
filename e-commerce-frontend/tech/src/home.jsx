import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api/api";

export default function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("home/products/");
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
            onClick={() => navigate(`/products/${product.id}`)}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md mb-2"
            />
            <h2 className="font-semibold text-lg">{product.name}</h2>
            <p className="text-gray-500">{product.brand}</p>
            <p className="font-bold mt-1">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
