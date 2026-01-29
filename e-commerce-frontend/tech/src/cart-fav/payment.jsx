import React, { useEffect, useState } from "react";
import axios from "axios";
import "./payment.css"
import { NavLink, useNavigate } from "react-router-dom";

export default function Payment() {
  const [data, setData] = useState(null);
  const [address, setAddress] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
    pincode: "",
});
const [total,setTotal]=useState()
  const userId = localStorage.getItem("username");
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/users/${userId}`);
        setData(res.data);

   if (res.data.paymentInfo) {
          setForm(res.data.paymentInfo);
          setAddress(true);
        }

        const totals = res.data
        const datas = totals.cart.reduce((acc,item)=>
         acc + (item.items * item.price),0
    )
    const discount = datas / 10
    const total = datas - discount
        setTotal(total)
      } catch (err) {
        console.log("Error fetching user:", err);
      }
    };
    fetch();
  }, [userId]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    if (!form.name || !form.address || !form.pincode) {
      alert("Please fill all fields");
      return;
    }

    if (!data?.cart || data.cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    const updatedData = {
      ...data,
      order: [...(data.order || []), ...data.cart],
      cart: [],
      paymentInfo: form, 
    };
setData(updatedData)
    try {
      await axios.patch(`http://localhost:5000/users/${userId}`, updatedData);
      alert("Payment successful ");
      navigate("/complete");
    } catch (err) {
      console.log("Payment error:", err);
      alert("Something went wrong while processing payment");
    }
  };

  const handleAddress=async()=>{
  setAddress(!address)

  }
return (
    <>
    <div className="payment-container">
 
    <div className="payment-form">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full name"
          className="payment-input"
          disabled={address}
          
        />
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="payment-textarea"
          disabled={address}

        />
        <input
          name="pincode"
          value={form.pincode}
          onChange={handleChange}
          placeholder="Pincode"
          className="payment-input"
          disabled={address}

        />
        {
            data?.paymentInfo ? (<div><p>Address already exist</p>
                <button className="payment-button" onClick={handleAddress}>New address</button>
            </div>):(
        <button className="payment-button" onClick={handleAddress}>New address</button>)
}
           <label>Payment methods :</label> 
        <select className="select-area">
            <option className="options">Upi</option>
            <option className="options">Credit card</option>
            <option className="options">Debit card</option>
            <option className="options">Cash on delivery</option>
        </select>
   
 

      {!data ? (
        <div className="loading-screen">
          <p>Loading...</p>
        </div>
      ) : data.cart?.length > 0 ? (
        <div className="cart-items">
          {data.cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-name">{item.name}</div>
              <div className="cart-item-price">₹{item.price}</div>
              <div className="cart-item-quantity">Total items: {item.items}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-items">
          No items found — go <NavLink to="/">home</NavLink>
        </div>
      )}

      <div className="payment-button-wrapper">
        <div>Total price 10% discound applyed: {total}</div>
        <button className="payment-button" onClick={handlePayment}>
          Complete Payment
        </button>
      </div>
    </div>
    </div>
  </>
);


}
