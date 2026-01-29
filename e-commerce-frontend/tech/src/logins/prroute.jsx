import React from "react";
import { Navigate } from "react-router-dom";

export default function Protect({children}){

    const isAdmin = localStorage.getItem("isAdmin")
    if(!isAdmin){return <Navigate to="/"/>}

return children

}