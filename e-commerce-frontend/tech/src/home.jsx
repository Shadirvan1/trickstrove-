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

  const addToCart = async (productId) => {
    try {
      const res = await api.post("cart/add/", { product: productId, quantity: 1 });
      alert(`${res.data.product} added to cart! Quantity: ${res.data.quantity}`);
    } catch (err) {
      console.error(err);
      alert("Failed to add product to cart.");
    }
  };

  return (
    <div className="mt-10 p-6">
      <h1 className="text-2xl font-bold mb-4">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-[80%] h-30 object-cover rounded-md mb-2"
              onClick={() => navigate(`/products/${product.id}`)}
            />
            <h2 className="font-semibold text-lg">{product.name}</h2>
            <p className="text-gray-500">{product.brand}</p>
            <p className="font-bold mt-1">${product.price}</p>
            <button
              onClick={() => addToCart(product.id)}
              className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
