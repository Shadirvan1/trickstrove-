import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Store() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [cart, setCart] = useState([]);
  const [price, setPrice] = useState(false);
  const userId = localStorage.getItem("username");

  useEffect(() => {
    axios
      .get("http://localhost:5000/products")
      .then((res) => setData(res.data))
      .catch((err) => console.log("Failed to fetch products", err));
  }, []);

  const addcart = async (id) => {
    try {
      const product = data.find((item) => item.id === id);
      if (!product) return alert("Product not found");

      const userres = await axios.get(`http://localhost:5000/users?username=${userId}`);
      const currentuser = userres.data[0];
      if (!currentuser) return alert("User not found");

      const existingItem = (currentuser.cart || []).find((item) => item.id === id);
      let updatedCart;

      if (existingItem) {
        updatedCart = currentuser.cart.map((item) =>
          item.id === id ? { ...item, items: item.items + 1 } : item
        );
        alert("Item quantity increased");
      } else {
        updatedCart = [...(currentuser.cart || []), { ...product, items: 1 }];
        alert("Item added to cart");
      }

      await axios.patch(`http://localhost:5000/users/${currentuser.id}`, { cart: updatedCart });
      setCart(updatedCart);
    } catch (err) {
      console.log("Error adding to cart:", err);
    }
  };

  const goToProduct = (id) => navigate(`/products/${id}`);

  return (
    <div className="min-h-screen bg-gray-100 p-8" style={{ paddingTop: "12vh" }}>
      
      {/* Category Tags & Price Filter */}
      <div className="flex flex-wrap gap-4 mb-6">
        {data
          .filter((item) => item.category)
          .map((item) => (
            <span
              key={item.id}
              data-aos="fade-right"
              className="px-4 py-2 cursor-pointer bg-gradient-to-r from-green-300 to-blue-300 text-white rounded-full font-semibold shadow hover:scale-105 transition transform"
            >
              {item.category}
            </span>
          ))}

        <span
          data-aos="fade-left"
          onClick={() => setPrice(!price)}
          className="px-4 py-2 cursor-pointer bg-gradient-to-r from-green-300 to-blue-300 text-white rounded-full font-semibold shadow hover:scale-105 transition transform"
        >
          Price
        </span>
      </div>

      {/* Price Filter Options */}
      {price && (
        <div className="flex flex-wrap gap-4 mb-10">
          {["<100000", "100000 - 120000", "100000 - 130000", "100000 - 150000"].map((range, idx) => (
            <span
              key={idx}
              data-aos="fade-right"
              className="px-4 py-2 cursor-pointer bg-gradient-to-r from-yellow-300 to-orange-300 text-white rounded-full font-medium shadow hover:scale-105 transition transform"
            >
              {range}
            </span>
          ))}
        </div>
      )}

      {/* Products Grid */}
      <div className="w-[90vw] mx-auto grid gap-12 grid-cols-2">
        {data
          .filter((t) => t.activity === "active" && t.name !== "")
          .map((t) => (
            <div
              key={t.id}
              data-aos="zoom-in-up"
              onClick={() => goToProduct(t.id)}
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition p-5 flex flex-col gap-4 cursor-pointer"
            >
              <div className="overflow-hidden rounded-xl">
                <img
                  className="w-full h-64 object-cover rounded-xl group-hover:scale-105 transition duration-500"
                  src={t.image}
                  alt={t.name}
                />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 tracking-tight">{t.name}</h4>
              <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{t.description}</p>
              <div className="flex justify-between items-center mt-auto">
                <span className="text-2xl font-bold text-green-600">${t.price}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addcart(t.id);
                  }}
                  className="px-5 py-2 text-sm rounded-full font-medium bg-gradient-to-r from-indigo-400 to-purple-500 text-white shadow hover:from-purple-500 hover:to-indigo-400 active:scale-95 transition transform"
                >
                  Add Cart
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
