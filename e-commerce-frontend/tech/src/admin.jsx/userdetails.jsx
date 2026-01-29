import axios from "axios";
import { useState,useEffect } from "react";
import "./user.css"
import {  useNavigate } from "react-router-dom";
export default function User(){
    const navigate = useNavigate()
const [user,setUser]=useState([])
const [block,setBlock]=useState(false)

useEffect(()=>{
axios.get(`http://localhost:5000/users`)
.then((res)=>setUser(res.data))
.catch((err)=>console.log("error",err))
},[])



const handleOrder =(id)=>{
navigate(`/adminPanel/userdetails/order/${id}`)
    
}
const handleWish = (id)=>{
navigate(`/adminPanel/userdetails/wish/${id}`)

}


const handleBlock=async(id)=>{

 const userToToggle = user.find(u => u.id === id);
   const newStatus = !userToToggle.active;
  if (!userToToggle) return;
    try{




await axios.patch(`http://localhost:5000/users/${id}`,{active:newStatus})
 setUser(user.map(u =>
      u.id === id ? { ...u, active: newStatus } : u
    ));

} catch (err){
console.log(err,"error")
}

}

const handleRemove =async(id)=>{


  
    try{
        await axios.delete(`http://localhost:5000/users/${id}`)
     
setUser(user.filter((item)=>item.id !== id))
        
    }catch{
        console.log("error");
        
    }
}

return(



    <>
    <div className="head">
    <h1>User details:</h1></div>
    <div className="container1">


{
user.map((item)=>(
<><div  key={item.id} className="grid_div">
    <div className="id">Id : { item.id}</div>
    <div className="name">Name : { item.name}</div>
    <div className="email">Email : { item.email}</div>
  <div className="item_div">  <button className="buttonn_div" onClick={()=>handleOrder(item.id)}>Orders</button></div>
  <div className="item_div">  <button className="buttonn_div" onClick={()=>handleWish(item.id)}>Wishlist</button></div>
  <div className="item_div">  <button className="buttonn_div" onClick={()=>handleBlock(item.id)}>{item.active ? "block" : "Activate"}</button></div>
  <div className="item_div">  <button className="buttonn_div" onClick={()=>handleRemove(item.id)}>Remove</button></div>
   
    </div>
</>
))
}

</div>
</>
)

}