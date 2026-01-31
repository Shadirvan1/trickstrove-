import React, { useEffect, useState } from "react";
import adminapi from "../../api/adminapi";
import { useNavigate } from "react-router-dom";

export default function OrderDetails() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    adminapi
      .get("order/getorders/") 
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  const handleStatusChange = async (deliveryId, status) => {
    try {
      await adminapi.patch(
        `order/update/0/`, 
        {
          delivery_id: deliveryId,
          status: status,
        }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order.delivery.id === deliveryId
            ? {
                ...order,
                delivery: { ...order.delivery, status: status },
              }
            : order
        )
      );
    } catch (err) {
      console.error("Error updating delivery status:", err);
    }
  };


  return (
<div className=" w-[80vw] p-6 bg-gray-50 min-h-screen">
  <h1 className="text-3xl font-bold mb-6 text-gray-800">Order Details</h1>

  {orders.length === 0 ? (
    <div className="text-center text-gray-500 text-lg py-20">
      No orders found
    </div>
  ) : (
    <div className="flex flex-col gap-6">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white shadow-md rounded-lg p-6 border border-gray-200 w-full"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Order ID: {order.id}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 w-full">
            <div className="w-full">
              <span className="font-medium text-gray-600">Product:</span>{" "}
              {order.product_name}
            </div>
            <div className="w-full">
              <span className="font-medium text-gray-600">Price:</span> ₹
              {order.product_price}
            </div>
            <div className="w-full">
              <span className="font-medium text-gray-600">Quantity:</span>{" "}
              {order.quantity}
            </div>
            <div className="w-full">
              <span className="font-medium text-gray-600">Subtotal:</span> ₹
              {order.subtotal}
            </div>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 w-full">
            <div className="w-full">
              <span className="font-medium text-gray-600">Receiver:</span>{" "}
              {order.address.full_name}
            </div>
            <div className="w-full">
              <span className="font-medium text-gray-600">Phone:</span>{" "}
              {order.address.phone}
            </div>
            <div className="w-full">
              <span className="font-medium text-gray-600">Address:</span>{" "}
              {order.address.address}
            </div>
            <div className="w-full">
              <span className="font-medium text-gray-600">Pincode:</span>{" "}
              {order.address.pincode}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center w-full">
            <div>
              <span className="font-medium text-gray-600">Payment Status:</span>{" "}
              {order.payment.status}
            </div>
            <div>
              <span className="font-medium text-gray-600">Delivery Status:</span>{" "}
              <span
                className={`px-2 py-1 rounded font-semibold ${
                  order.delivery.status === "DELIVERED"
                    ? "bg-green-100 text-green-800"
                    : order.delivery.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.delivery.status === "PROCESSING"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {order.delivery.status}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-medium text-gray-600">
                Update Status:
              </label>
              <select
                className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={order.delivery.status}
                onChange={(e) =>
                  handleStatusChange(order.delivery.id, e.target.value)
                }
              >
                <option value="PENDING">PENDING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

  );
}
