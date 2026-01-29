import React, { useEffect, useState } from "react";
import axios from "axios";
import "./orderdetails.css";
import { Navigate, useNavigate } from "react-router-dom";
import "./orderhistory.css"
export default function Pending() {
  const [users, setUsers] = useState([]);
  const [address,setAddress]=useState({})
const navigate = useNavigate()
  useEffect(() => {
    axios
      .get("http://localhost:5000/users")
      .then((res) =>{ setUsers(res.data)
       const data = res.data
      const datas = data.map((item)=>item.paymentInfo)
     setAddress(datas)
     console.log(datas)
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  
  const handleOrder = async (userId, itemId) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/users/${userId}`);

      if (!data.order) return;

      const updatedOrders = data.order.filter((item) => item.id !== itemId);
      const postedOrder = data.order.find((item) => item.id === itemId);

    
      await axios.patch(`http://localhost:5000/users/${userId}`, {
        order: updatedOrders,
      });

      await axios.post("http://localhost:5000/orders", {
        ...postedOrder,
        userId,
        userName: data.name, 
        status: "completed",
      });

   
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, order: updatedOrders } : u
        )
      );
    } catch (err) {
      console.error("Error moving order:", err);
    }
  };
const handleHistory = ()=>{
  navigate("/adminpanel/orderhistory")
}
  const hasPending = users.some((u) => u.order && u.order.length > 0);
  return (
    <div className="container_div">
      {!hasPending ? (
        <div className="empty_div">No pending orders</div>
      ) : (
        users.map(
          (u) =>
            u.order &&
            u.order.length > 0 && (
              <div key={u.id} className="user_orders">
                <h2  className="user_title">User Id :{u.id}</h2>

                <div className="header_row">
                  <div>Product Name</div>
                  <div>Product ID</div>
                  <div>Price</div>
                  <div>Quantity</div>
                  <div>Reciver name</div>
                  <div>Reciver address</div>
                  <div>Reciver pincode</div>
                  <div>Action</div>
                </div>

                {u.order.map((item,index) => (
                  <div key={item.id} className="data_row">
                    <div>{item.name}</div>
                    <div>{item.id}</div>
                    <div>₹{item.price}</div>
                    <div>{item.items}</div>
                    <div>{u.paymentInfo?.name || "non"}</div>
                    <div  style={{overflow:"scroll"}}>{u.paymentInfo?.address || "non" }</div>
                    <div>{u.paymentInfo?.pincode || "non"}</div>

                   
                    <button
                      className="order_btn"
                      onClick={() => handleOrder(u.id, item.id)}
                    >
                      Complete order
                    </button>
                  </div>
                ))}
              </div>
            )
        )
      )}
      <button className="orderhistory" onClick={handleHistory}>Order history</button>
    </div>
  );
}
