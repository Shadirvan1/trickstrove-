import { useState } from "react";
import logapi from "../api/logapi";
import { NavLink, useNavigate } from "react-router-dom";

export default function Login() {
  const [data,setData]=useState({username:"",password:""});
  const [msg,setMsg]=useState("");
const navigate = useNavigate()
  const login=async(e)=>{
    e.preventDefault();
    try{
      const res=await logapi.post("user/login/",data);
      localStorage.setItem("access_token",res.data.user.access);
      localStorage.setItem('email',res.data.user.email)
      localStorage.setItem('refresh',res.data.user.refresh)
      localStorage.setItem('user_id',res.data.user.user_id)
      if (res.data.user.isAdmin){
        navigate('/adminpanel/dashboard')
        localStorage.setItem("isAdmin",res.data.user.isAdmin)

      }else{
        navigate('/')
      }



      setMsg("Login successful");
    }catch{
      setMsg("Invalid credentials or email not verified");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={login} className="bg-white p-8 rounded-xl shadow-md w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <input name="username" placeholder="Username" onChange={e=>setData({...data,username:e.target.value})} className="w-full border p-2 rounded"/>
        <input type="password" name="password" placeholder="Password" onChange={e=>setData({...data,password:e.target.value})} className="w-full border p-2 rounded"/>
        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Login</button>
        {msg && <p className="text-red-500 text-sm">{msg}</p>}
        <NavLink to="/register" >Register</NavLink>
      </form>

    </div>
  );
}
