import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

/* ---------- Razorpay loader ---------- */
const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function PaymentPage() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(true);

  const [newAddress, setNewAddress] = useState({
    full_name: "",
    phone: "",
    address: "",
    pincode: "",
  });

  /* ---------- Load cart + address ---------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cartRes = await api.get("cart/get/");
        const addressRes = await api.get("payment/addresses/");
        setCartItems(cartRes.data || []);
        setAddresses(addressRes.data || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load checkout data");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  /* ---------- Address input ---------- */
  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------- Main payment handler ---------- */
  const handleCompletePayment = async () => {
    if (
      !selectedAddress &&
      (!newAddress.full_name ||
        !newAddress.phone ||
        !newAddress.address ||
        !newAddress.pincode)
    ) {
      alert("Please select or add address");
      return;
    }

    try {
      let addressId = selectedAddress;

      /* 1️⃣ Create address if needed */
      if (!selectedAddress) {
        const addrRes = await api.post("payment/addresses/", newAddress);
        addressId = addrRes.data.id;
      }

      /* 2️⃣ Place order */
      const orderRes = await api.post("order/place/", {
        address_id: Number(addressId),
        payment_method: paymentMethod,
      });

      const orderId = orderRes.data.order_id;

      /* 3️⃣ COD flow */
      if (paymentMethod === "COD") {
        alert("Order placed successfully!");
        navigate("/complete");
        return;
      }

      /* 4️⃣ Online payment */
      const razorLoaded = await loadRazorpay();
      if (!razorLoaded) {
        alert("Razorpay failed to load");
        return;
      }

      /* 5️⃣ Create Razorpay order */
      const razorRes = await api.post("order/razorpay/create/", {
        order_id: orderId,
      });

      const options = {
        key: razorRes.data.key,
        amount: razorRes.data.amount,
        currency: "INR",
        name: "TricksTrove",
        description: "Order Payment",
        order_id: razorRes.data.razorpay_order_id,

        handler: async function (response) {
          try {
            await api.post("order/razorpay/verify/", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: orderId,
            });

            alert("Payment successful!");
            navigate("/complete");
          } catch (err) {
            console.error(err);
            alert("Payment verification failed");
          }
        },

        prefill: {
          email: localStorage.getItem("email") || "",
          contact: localStorage.getItem("phone") || "",
        },

        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  if (loading) {
    return <p className="text-center mt-20">Loading checkout...</p>;
  }

  return (
    <div className="mt-20 min-h-screen p-6 bg-gray-100 flex flex-col lg:flex-row gap-6">

      {/* -------- Cart -------- */}
      <div className="flex-1 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Cart Items</h2>

        {cartItems.length === 0 ? (
          <p>No items in cart</p>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b py-2"
            >
              <div>
                <p className="font-semibold">{item.product.name}</p>
                <p className="text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-bold">
                ₹{item.product.price * item.quantity}
              </p>
            </div>
          ))
        )}
      </div>

      {/* -------- Payment -------- */}
      <div className="w-full lg:w-96 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Delivery & Payment</h2>

        {/* Address select */}
        {addresses.length > 0 && (
          <select
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(Number(e.target.value))}
            className="w-full p-2 border rounded mb-4"
          >
            <option value="">-- New Address --</option>
            {addresses.map((addr) => (
              <option key={addr.id} value={addr.id}>
                {addr.full_name}, {addr.pincode}
              </option>
            ))}
          </select>
        )}

        {/* New address */}
        {!selectedAddress && (
          <div className="space-y-2 mb-4">
            <input
              name="full_name"
              placeholder="Full Name"
              value={newAddress.full_name}
              onChange={handleNewAddressChange}
              className="w-full p-2 border rounded"
            />
            <input
              name="phone"
              placeholder="Phone"
              value={newAddress.phone}
              onChange={handleNewAddressChange}
              className="w-full p-2 border rounded"
            />
            <textarea
              name="address"
              placeholder="Address"
              value={newAddress.address}
              onChange={handleNewAddressChange}
              className="w-full p-2 border rounded"
            />
            <input
              name="pincode"
              placeholder="Pincode"
              value={newAddress.pincode}
              onChange={handleNewAddressChange}
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        {/* Payment method */}
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="COD">Cash on Delivery</option>
          <option value="UPI">UPI</option>
          <option value="CARD">Credit / Debit Card</option>
        </select>

        <button
          onClick={handleCompletePayment}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Complete Payment
        </button>
      </div>
    </div>
  );
}
