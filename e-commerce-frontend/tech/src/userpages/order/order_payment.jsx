import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function PaymentPage() {
  const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    full_name: "",
    phone: "",
    address: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const userId = localStorage.getItem("username");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cartRes = await api.get("cart/get/");
        setCartItems(cartRes.data);

        const addressRes = await api.get("payment/addresses/");
        setAddresses(addressRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to load cart or addresses");
        navigate("/");
      }
    };

    fetchData();
  }, [navigate]);

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

const handleCompletePayment = async () => {
  if (
    !selectedAddress &&
    (!newAddress.full_name ||
      !newAddress.phone ||
      !newAddress.address ||
      !newAddress.pincode)
  ) {
    alert("Please select or enter an address");
    return;
  }

  try {
    let addressId = selectedAddress;

    if (!selectedAddress) {
      const res = await api.post("payment/addresses/", newAddress);
      addressId = res.data.id;
    }

    // 1️⃣ PLACE ORDER
    const orderRes = await api.post("order/place/", {
      address_id: addressId,
      payment_method: paymentMethod,
    });

    // COD → DONE
    if (paymentMethod === "COD") {
      alert("Order placed successfully!");
      navigate("/complete");
      return;
    }

    // 2️⃣ ONLINE PAYMENT (UPI / CARD)
    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      alert("Razorpay SDK failed to load");
      return;
    }

    // ⚠️ assuming backend returns order_items
    const orderItemId = orderRes.data.order_items[0].id;

    // 3️⃣ CREATE RAZORPAY ORDER
    const razorRes = await api.post("razorpay/create/", {
      order_item_id: orderItemId,
    });

    const options = {
      key: razorRes.data.razorpay_key,
      amount: razorRes.data.amount,
      currency: "INR",
      name: "TricksTrove",
      description: "Order Payment",
      order_id: razorRes.data.razorpay_order_id,

      handler: async function (response) {
        await api.post("razorpay/verify/", {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          order_item_id: orderItemId,
        });

        alert("Payment successful ");
        navigate("/complete");
      },

      theme: { color: "#2563eb" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error(err);
    alert("Payment failed");
  }
};


  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="mt-20 min-h-screen p-6 bg-gray-100 flex flex-col lg:flex-row gap-6">
      
      <div className="flex-1 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Cart Items</h2>
        {cartItems.length === 0 ? (
          <p>No items in cart</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.product.id} className="flex justify-between items-center border-b py-2">
              <div>
                <p className="font-semibold">{item.product.name}</p>
                <p className="text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-bold">₹{item.product.price * item.quantity}</p>
            </div>
          ))
        )}
      </div>

      <div className="w-full lg:w-96 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Delivery & Payment</h2>

        {addresses.length > 0 && (
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Select Address:</label>
            <select
              value={selectedAddress || ""}
              onChange={(e) => setSelectedAddress(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            >
              <option value="">-- Use New Address --</option>
              {addresses.map((addr) => (
                <option key={addr.id} value={addr.id}>
                  {addr.full_name}, {addr.address}, {addr.pincode}
                </option>
              ))}
            </select>
          </div>
        )}

        {!selectedAddress && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Enter New Address</h3>
            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              value={newAddress.full_name}
              onChange={handleNewAddressChange}
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={newAddress.phone}
              onChange={handleNewAddressChange}
              className="w-full p-2 mb-2 border rounded"
            />
            <textarea
              name="address"
              placeholder="Address"
              value={newAddress.address}
              onChange={handleNewAddressChange}
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={newAddress.pincode}
              onChange={handleNewAddressChange}
              className="w-full p-2 mb-2 border rounded"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Payment Method:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="COD">Cash on Delivery</option>
            <option value="UPI">UPI</option>
            <option value="CARD">Credit / Debit Card</option>
          </select>
        </div>

        <button
          onClick={handleCompletePayment}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Complete Payment
        </button>
      </div>
    </div>
  );
}
