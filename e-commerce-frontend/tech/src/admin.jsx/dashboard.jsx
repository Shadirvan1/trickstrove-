import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import "./dash.css";
import Chart from "./chart";
import SalesChart from "./sales";
export const UserContext = createContext()

export default function Dash() {


  const [data, setData] = useState([]);
  const [order, setOrder] = useState([]);
  const [total, setTotal] = useState([]);
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [sale, setSale] = useState(0);
  const [orders, setOrders] = useState(0);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/users`)
      .then((res) => {
        const user = res.data;
        
        setData(user);

        const flat = user.flatMap((user) => user.order || []);
        const order = flat.reduce((acc, item) => {
          return acc + (item.items || 0);
        }, 0);
        setCount(order);
        const sales = flat.reduce((acc, item) => {
          return acc + (item.items * item.price || 0);
        }, 0);
        setSale(sales);
      })
      .catch((err) => console.log("error user", err));
  }, []);



  useEffect(() => {
    axios
      .get(`http://localhost:5000/products`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.log("error", err));
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/orders`)
      .then((res) =>{ setOrder(res.data)
        const datas = res.data
       
        

  
const orders = datas.reduce((acc,item)=>{
 return acc + (item.items || 0);

},0)
const total = datas.reduce((acc,item)=>{
  return acc + (item.items * item.price || 0 )
},0)

console.log("error",orders);
setTotal(total)
setOrders(orders)
      })
      .catch((err) => console.log("error", err));
  }, []);

const dashboardData = {
    totalProducts: products.length,
    pendingOrders: count,
    pendingSales: sale,
    totalUsers: data.length,
    overallOrders: orders,
    overallSales: total,
  };



  return (<>
<UserContext.Provider value={dashboardData}>
  <><h1 className="h1">Dashboard</h1></>
    <div className="user_div">
     
      <div>
        <h1>Total products : {products.length}</h1>
      </div>
      <div>
        <h1>Pending orders : {count}</h1>
      </div>
      <div>
        <h1>Pending revenue : {sale}</h1>
      </div>
       <div>
        <h1>Total users : {data.length}</h1>
      </div>
       <div>
        <h1>Overall orders : {orders}</h1>
      </div>
       <div>
        <h1>Overall sales : {total}</h1>
      </div>
    </div>


    <div className="chart"><Chart /></div>
    <div className="sales"><SalesChart /></div>
    
</UserContext.Provider>
   
    </>
  );
}
