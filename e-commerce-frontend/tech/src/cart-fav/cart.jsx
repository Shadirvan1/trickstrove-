import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api"; 

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("cart/get/");
        setCartItems(res.data);
        updateTotals(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load cart. Make sure you are logged in.");
        navigate("/");
      }
    };
    fetchCart();
  }, [navigate]);

  const updateTotals = (items) => {
    const price = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const quantity = items.reduce((acc, item) => acc + item.quantity, 0);
    setTotalPrice(price);
    setTotalQuantity(quantity);
  };

  const handleAdd = async (productId) => {
    try {
      await api.post("cart/addquantity/", { product: productId,quantity:1 });
      const updatedItems = cartItems.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCartItems(updatedItems);
      updateTotals(updatedItems);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMinus = async (productId) => {
    try {
      const item = cartItems.find((i) => i.product.id === productId);
      if (!item) return;

      await api.post("cart/minus/", { product: productId,quantity:1 });

      let updatedItems;
      if (item.quantity === 1) {
        updatedItems = cartItems.filter((i) => i.product.id !== productId);
      } else {
        updatedItems = cartItems.map((i) =>
          i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i
        );
      }

      setCartItems(updatedItems);
      updateTotals(updatedItems);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await api.post("cart/remove/", { product: productId,quantity:1 });
      const updatedItems = cartItems.filter((i) => i.product.id !== productId);
      setCartItems(updatedItems);
      updateTotals(updatedItems);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOrder = () => {
    if (cartItems.length > 0) {
      navigate("/payment");
    } else {
      alert("Cart is empty");
    }
  };

  const discount = totalPrice * 0.1;
  const finalPrice = totalPrice - discount;

  return (
    <div className="mt-20 flex flex-col lg:flex-row gap-6 p-6 bg-gray-50 min-h-screen">
      
      <div className="flex-1">
        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600">
              Add items from{" "}
              <span
                className="text-blue-500 hover:underline cursor-pointer"
                onClick={() => navigate("/")}
              >
                Home
              </span>
            </p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.product.id}
              className="flex flex-col sm:flex-row items-center gap-4 mb-4 bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-28 h-28 object-cover rounded cursor-pointer"
                onClick={() => navigate(`/products/${item.product.id}`)}
              />
              <div className="flex-1 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center w-full">
                <div className="flex flex-col gap-1">
                  <h3
                    className="font-semibold text-lg hover:text-blue-500 cursor-pointer"
                    onClick={() => navigate(`/products/${item.product.id}`)}
                  >
                    {item.product.name}
                  </h3>
                  <p className="text-gray-500">{item.product.brand}</p>
                  <p className="font-bold text-gray-700">₹{item.product.price}</p>
                </div>

                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <button
                    onClick={() => handleMinus(item.product.id)}
                    className="w-8 h-8 flex justify-center items-center bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => handleAdd(item.product.id)}
                    className="w-8 h-8 flex justify-center items-center bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => handleRemove(item.product.id)}
                  className="text-red-500 font-semibold mt-2 sm:mt-0 hover:text-red-600 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="w-full lg:w-80 bg-white p-6 rounded-lg shadow-md h-max">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">Cart Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Items:</span>
          <span>{totalQuantity}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Price:</span>
          <span>₹{totalPrice}</span>
        </div>
        <div className="flex justify-between mb-2 text-green-600">
          <span>Discount (10%):</span>
          <span>-₹{discount}</span>
        </div>
        <div className="flex justify-between font-bold text-lg mb-4 border-t pt-2">
          <span>Total:</span>
          <span>₹{finalPrice}</span>
        </div>
        <button
          onClick={handleOrder}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
