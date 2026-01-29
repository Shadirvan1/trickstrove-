import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "./api/api";

export default function SingleProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`home/products/${id}/`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Back
      </button>
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={product.image}
          alt={product.name}
          className="w-full md:w-1/2 h-auto object-cover rounded"
        />
        <div className="md:w-1/2">
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-500 mb-2">{product.brand}</p>
          <p className="text-gray-700 mb-2">{product.category}</p>
          <p className="font-bold text-xl mb-4">${product.price}</p>
          <p className="mb-4">{product.description}</p>
          <p className="text-gray-600">Quantity: {product.quantity}</p>
        </div>
      </div>
    </div>
  );
}
