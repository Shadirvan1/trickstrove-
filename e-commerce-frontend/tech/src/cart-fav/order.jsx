import {useEffect, useState} from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import './order.css'
export default function Order(){
    const userId = localStorage.getItem("username")
const [data,setData]=useState(null)

useEffect(()=>{
const fetch = async ()=>{
   const datas =await axios.get(`http://localhost:5000/users/${userId}`)
     const user = datas.data
     setData(user)
}
fetch()
},[userId])


  const handleRemove = async (ids) => {
    if (!data.order) return;

    const orders = data.order.filter((ele) => ele.id !== ids);

    try {
      await axios.patch(`http://localhost:5000/users/${userId}`, {
        order: orders,
      });
      setData((pre) => ({ ...pre, order: orders }));
 

    } catch (err) {
      console.log("error", err);
    }
  };



return(
<>
  {data?.order && data?.order.length > 0 ? (
    <div className="orders_container">
      {data.order.map((item) => (
        <div className="order_item" key={item.id}>
          <div className="order_image">
            <img src={item.image} alt={item.name} />
          </div>
          <div className="order_name">
            <h2>{item.name}</h2>
          </div>
          <div className="order_category">
            <p>{item.category}</p>
          </div>
          <div className="order_price">
            <p>₹{item.price}</p>
          </div>
          <button className="order_cancel_btn" onClick={() => handleRemove(item.id)}>
            Cancel Order
          </button>
        </div>
      ))}
    </div>
  ) : (
    <div className="orders_empty">
      <h3>No items found</h3>
      <p>
        Go order some items: <NavLink to="/home">Home</NavLink>
      </p>
    </div>
  )}
</>
)}