import React, { useState } from 'react'
import {useNavigate} from "react-router-dom"
export default function Homepageprotector({childern}) {
 const user_id = localStorage.getItem('user_id')
 const admin = localStorage.getItem("isAdmin")
 const navigate = useNavigate()
    if (user_id && admin){
        navigate("/adminpanel/dashboard")
    }


  return childern
}
