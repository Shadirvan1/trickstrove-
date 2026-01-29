import {useEffect, useState} from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import "./wish.css"
export default function Wish(){
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

const wishlist = data?.wishlist || [];



 const handleRemove = async (ids) => {
    if (!data.wishlist) return;

    const whis = data.wishlist.filter((ele) => ele.id !== ids);

    try {
      await axios.patch(`http://localhost:5000/users/${userId}`, {
        wishlist: whis,
      });
      setData((pre) => ({ ...pre, wishlist: whis }));
 

    } catch (err) {
      console.log("error", err);
    }
  };





return( <>
  {data?.wishlist && data?.wishlist.length > 0 ? (
    <div className="wishlist_container">
      {data.wishlist.map((item) => (
        <div className="wishlist_item" key={item.id}>
          <div className="wishlist_image">
            <img src={item.image} alt={item.name} />
          </div>
          <div className="wishlist_name">
            <h2>{item.name}</h2>
          </div>
          <div className="wishlist_category">
            <p>{item.category}</p>
          </div>
          <div className="wishlist_price">
            <p>₹{item.price}</p>
          </div>
          <button className="wishlist_remove_btn" onClick={() => handleRemove(item.id)}>
            Remove from Wishlist
          </button>
        </div>
      ))}
    </div>
  ) : (
    <div className="wishlist_empty">
      <h3>No items found</h3>
      <p>
        Go add some items: <NavLink to="/home">Home</NavLink>
      </p>
    </div>
  )}
</>
)
}