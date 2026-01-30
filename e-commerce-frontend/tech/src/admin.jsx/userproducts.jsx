import adminapi from "../api/adminapi";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Userorder() {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [id]);

  const fetchOrders = async () => {
    try {
      const res = await adminapi.get(`user/users/${id}/orders/`);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching user orders", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="ml-[20vw] p-6">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="ml-[20vw] p-6 text-gray-500">
        No orders found for this user
      </div>
    );
  }

  return (
    <div className="ml-[20vw] w-[80vw] p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        User Orders (User ID: {id})
      </h1>

      <div className="flex flex-col gap-6">
        {orders.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow rounded-lg p-5 border"
          >
            <div className="flex gap-4 mb-4">
           

              <div>
                <h3 className="text-lg font-semibold">
                  {item.product_name}
                </h3>
                <p className="text-sm text-gray-500">
                  Price: ₹{item.product_price}
                </p>
                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
                <p className="text-sm font-semibold">
                  Subtotal: ₹{item.subtotal}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div>
                <span className="font-medium">Receiver:</span>{" "}
                {item.address.full_name}
              </div>
              <div>
                <span className="font-medium">Phone:</span>{" "}
                {item.address.phone}
              </div>
              <div className="md:col-span-2">
                <span className="font-medium">Address:</span>{" "}
                {item.address.address} - {item.address.pincode}
              </div>
            </div>

            <div className="flex flex-wrap gap-6 items-center">
              <div>
                <span className="font-medium">Payment:</span>{" "}
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    item.payment.status === "PAID"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item.payment.status}
                </span>
              </div>

              <div>
                <span className="font-medium">Delivery:</span>{" "}
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    item.delivery.status === "DELIVERED"
                      ? "bg-green-100 text-green-700"
                      : item.delivery.status === "SHIPPED"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {item.delivery.status}
                </span>
              </div>

              <div className="text-sm text-gray-500">
                Ordered on{" "}
                {new Date(item.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
