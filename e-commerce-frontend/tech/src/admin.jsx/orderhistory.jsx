import axios from "axios";
import React, { useEffect, useState } from "react";
import "./orderhistory.css";

export default function OrderHistory() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/orders")
      .then((pre) => setData(pre.data))
      .catch((err) => console.log("error", err));
  }, []);

  return (
    <div className="order-history">
      <h2 className="table-title">Order History</h2>

      <table className="order-table">
        <thead>
          <tr>
            <th className="table-head">Customer ID</th>
            <th className="table-head">Username</th>
            <th className="table-head">Item ID</th>
            <th className="table-head">Item Name</th>
            <th className="table-head">Brand</th>
            <th className="table-head">Category</th>
            <th className="table-head">Price</th>
            <th className="table-head">Description</th>
            <th className="table-head">Quantity</th>
            <th className="table-head">Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr className="table-row" key={index}>
              <td className="table-data">{item.userId}</td>
              <td className="table-data">{item.userName}</td>
              <td className="table-data">{item.id}</td>
              <td className="table-data">{item.name}</td>
              <td className="table-data">{item.brand}</td>
              <td className="table-data">{item.category}</td>
              <td className="table-data">${item.price}</td>
              <td className="table-data">{item.description}</td>
              <td className="table-data">{item.items}</td>
              <td className="table-data">
                <span
                  className={`status-badge ${
                    item.status === "Delivered"
                      ? "delivered"
                      : item.status === "Pending"
                      ? "pending"
                      : "canceled"
                  }`}
                >
                  {item.status || "Pending"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
