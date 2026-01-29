import React from "react";
import "./sucess.css"
import { useNavigate } from "react-router-dom";
export default function Success(){
    const navigate =useNavigate()

    return (

        <>
        <div className="sucess"> 
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYf-yn96mf5wuchdC1h_3PdzfM4KiBxA-Huw&s" />
            
             <br /> Your odrder completed </div>
             {
                setTimeout(()=>{navigate("/")},2000)
             }
        
        </>
    )
}