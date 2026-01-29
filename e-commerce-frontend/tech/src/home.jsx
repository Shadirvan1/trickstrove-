import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {Menu, ShoppingBasket, X,ShoppingCart, Package, Heart, House, ArrowRight} from "lucide-react";
import "aos/dist/aos.css"; 
import AOS from "aos";
import { NavLink } from "react-router-dom";
export const UserContext = createContext();

export default function Home({ children }) {


      useEffect(() => {
      AOS.init({
        duration: 1500,  // animation duration in ms
        easing: "ease-in-out", // smooth animation
        once: true,      // animate only once when scrolling down
      });
    }, []);
  const [tr,setTr]=useState(false)
  const userId = localStorage.getItem("username");
  localStorage.setItem("userid", userId);
const navigate=useNavigate()
return (
  <div className="scroll-smooth min-h-screen w-full  bg-gradient-to-t from-gray-600 to-gray-900 py-10 mt-10 px-6">
    <div>

<video
data-aos="fade-up"
className="absolute top-0 left-0 w-full h-full object-cover"
  autoPlay
    muted
    loop
    playsInline
src={video1}>


</video>
  <div className="flex flex-col justify-center items-center text-center h-auto text-white">
    <h1 className="text-5xl font-bold drop-shadow-lg text-gray-300 font-mono">PORSCHE</h1>
  
  </div>
 {!tr && <div
 data-aos="fade-right"
 className="absolute top-20">
    <h1 className="text-xl font-bold drop-shadow-lg text-gray-300 font-mono border p-2 bg-transparent backdrop-blur-sm rounded-md " 
    onClick={()=>setTr(!tr)}
    
    ><Menu  size={40} color="#000000" strokeWidth={2.75} /></h1>
  
  </div>}
  <div
  className={`
    fixed top-20 left-0 z-50 bg-black/80 rounded-sm h-2/3 w-1/4 shadow-9xl
    transition-transform duration-500 ease-in-out flex flex-col   justify-between
    ${tr ? "translate-x-0" : "-translate-x-full"}
  `}
>

  <div className="flex justify-end p-2">
    <X
      onClick={() => setTr(false)}
      className=" cursor-pointer hover:rotate-90 transition-transform duration-300"
      size={35}
     color="#fff"
    />
  </div>


  <div className=" text-white  p-5 font-light hover:bg-white/40 hover:text-black  rounded-xl">
    <h2 className="text-xl flex items-center gap-3"><ShoppingBasket  strokeWidth={2}  />Store</h2>
  </div>
  <div className=" text-white  p-5 font-light hover:bg-white/40 hover:text-black  rounded-xl">
    <h2 className="text-xl flex items-center gap-3"><ShoppingCart />Cart</h2>
  </div>
  <div className=" text-white  p-5 font-light hover:bg-white/40 hover:text-black  rounded-xl">
    <h2 className="text-xl flex items-center gap-3"><Package />Orders</h2>
  </div>
  <div className=" text-white  p-5 font-light hover:bg-white/40 hover:text-black  rounded-xl">
    <h2 className="text-xl flex items-center gap-3"><Heart />Whishlist</h2>
  </div>
 <div className=" text-white  flex justify-center p-5 font-light ">
   <button className="
  px-15 py-3 rounded-full font-semibold 
  bg-gradient-to-r from-black via-gray-700 to-white 
  text-white
  hover:from-white hover:via-gray-400 hover:to-black
  hover:text-black
  transition-all duration-300 
  shadow-lg hover:shadow-xl
" >Logout</button>
  </div>
</div>
<div 
data-aos="fade-up"
className=" absolute z-30 top-[50vh] left-[8vw]">
  <h1 className="text-8xl font-sans text-gray-100">25 Years of </h1>
  <h1 className="text-8xl font-sans text-gray-100"> Carrera GT.</h1>
  <button onClick={()=>navigate("/store")} className="hover:bg-black/60 mt-10 text-white px-10 py-3 border">Go to store</button>
</div>


  </div >
  <div className="relative h-[90vh]"></div>
<div className="flex gap-20  justify-center mt-10">


  <NavLink data-aos="fade-up-left" className="relative w-82 h-52 overflow-hidden rounded-lg">
    <img  className="hover:scale-110 duration-600 w-full h-full object-cover " src={maccan}/>
    <h1 className="absolute bottom-2 left-2 text-white text-lg font-semibold drop-shadow-lg gap-35 flex">
      Porsche Macan
    <ArrowRight className="hover:bg-black/20 rounded-sm"  size={25} color="#ffffff" />

    </h1>
  </NavLink>

  <NavLink data-aos="fade-up" className="relative w-82 h-52 rounded-lg overflow-hidden">
    <img className="hover:scale-110 duration-600 w-full h-full object-cover rounded-lg" src={panamera}/>
    <h1 className="absolute bottom-2 left-2 text-white text-lg font-semibold drop-shadow-lg gap-46 flex">
      Panamera
    <ArrowRight className="hover:bg-black/20 rounded-sm" size={25} color="#ffffff" />

    </h1>
  </NavLink>

  <NavLink data-aos="fade-up-right" className="relative w-82 h-52 rounded-lg overflow-hidden">
    <img className="hover:scale-110 duration-600 w-full h-full object-cover rounded-lg" src={nine}/>
  <div>  <h1 className="absolute bottom-2 left-2 text-white text-lg font-semibold drop-shadow-lg gap-42 flex">
      Porsche 911
    <ArrowRight className="hover:bg-black/20 rounded-sm"  size={25} color="#ffffff" />
    </h1>
    </div>
  </NavLink>

</div>
<br />
<br />
<br />
<div>
</div>
</div>
);

}