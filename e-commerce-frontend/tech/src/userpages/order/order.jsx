import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import api from "../../api/api"; 

export default function Orders() {
  const userId = localStorage.getItem("username");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get(`order/orders/`); 
        const allItems = res.data.flatMap((order) => 
          order.items.map((item) => ({ ...item, orderId: order.id }))
        );
        setItems(allItems);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId]);

  const handleCancel = async (orderId, itemId) => {
    try {
      await api.patch(`order/orders/${orderId}/cancel-item/${itemId}/`);
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, delivery: { ...item.delivery, status: "CANCELLED" } } : item
        )
      );
    } catch (err) {
      console.error("Error cancelling order item:", err);
      alert("Failed to cancel item");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading order items...</p>;

  if (!items || items.length === 0) {
    return (
      <div className="orders_empty text-center mt-10">
        <h3>No order items found</h3>
        <p>
          Go order some items: <NavLink to="/home" className="text-blue-500">Home</NavLink>
        </p>
      </div>
    );
  }

  return (
    <div className="mt-20 orders_container p-6 grid gap-6">
      {items.map((item) => (
        <div key={item.id} className="bg-white p-4 rounded shadow flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={item.product_image} alt={item.product_name} className="w-16 h-16 object-cover rounded" />
            <div>
              <p className="font-semibold">{item.product_name}</p>
              <p className="text-gray-500">{item.product_category}</p>
              <p className="text-gray-700">₹{item.product_price} × {item.quantity}</p>
              <p className="text-sm text-gray-400">Order #{item.orderId}</p>
              <p className={`text-sm font-semibold ${item.delivery?.status === "CANCELLED" ? "text-red-500" : "text-green-500"}`}>
                Status: {item.delivery?.status || "PENDING"}
              </p>
            </div>
          </div>
          {item.delivery?.status !== "CANCELLED" && (
            <button
              onClick={() => handleCancel(item.orderId, item.id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Cancel
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
