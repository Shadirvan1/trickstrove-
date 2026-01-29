import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./userproduct.css";

export default function Userwish() {
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

  if (!data.wishlist || data.wishlist.length === 0) {
    return <div className="error_div">No items found</div>;
  }

  return (
    <>
      <div>
        <h2>User Wishlist (ID: {id})</h2>
      </div>

      <div className="wishlist_grid">
        {data.wishlist.map((item) => (
          <div key={item.id} className="wishlist_card">
            <img src={item.image} alt={item.name} />
            <h4>{item.name}</h4>
            <p>{item.category}</p>
            <p>{item.description}</p>
            <p>Qty: {item.quantity}</p>
            <p>₹{item.price}</p>
          </div>
        ))}
      </div>
    </>
  );
}
