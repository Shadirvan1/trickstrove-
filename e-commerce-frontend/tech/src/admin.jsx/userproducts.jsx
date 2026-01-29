import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./userproduct.css";

export default function Userorder() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/users/${id}`)
      .then((res) => setData(res.data))
      .catch((err) => console.log("error", err));
  }, [id]);

  if (!data) {
    return <div className="error_div">Loading user data...</div>;
  }

  if (!data.order || data.order.length === 0) {
    return <div className="error_div">No items found</div>;
  }

  return (
    <>
      <div className="userorder_header">
        <h2>User Orders (ID: {id})</h2>
      </div>

      <div className="order_grid">
        {data.order.map((item) => (
          <div key={item.id} className="order_card">
            <div className="order_img">
              <img src={item.image} alt={item.name} className="order_image" />
            </div>
            <div className="order_name">
              <h4>{item.name}</h4>
            </div>
            <div className="order_category">
              <p>{item.category}</p>
            </div>
            <div className="order_description">
              <p>{item.description}</p>
            </div>
            <div className="order_quantity">
              <p>Qty: {item.quantity}</p>
            </div>
            <div className="order_price">
              <p>₹{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
