import { BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Login from './logins/login';
import Register from './logins/registration';
import Home from "./home";
import Products from "./product";
import Cart from "./cart-fav/cart";
import Success from "./cart-fav/success";
import Empty from "./muliple";
import Layout from "./navbar/layout";
import Wish from "./cart-fav/wish";
import Order from "./cart-fav/order";
import Protect from './logins/prroute'
import Panel from './admin.jsx/adminpanel'
import Dash from "./admin.jsx/dashboard";
import Orderdetails from "./admin.jsx/orderdetails"
import User from "./admin.jsx/userdetails";
import Userorder from "./admin.jsx/userproducts";
import Userwhish from "./admin.jsx/userwishlist";
import Productss from "./admin.jsx/productss";
import Edit from "./admin.jsx/edit";
import Payment from "./cart-fav/payment";
import OrderHistory from "./admin.jsx/orderhistory";
import Store from "./store";
import VerifyOtp from "./logins/otp_verify";
import ResendOtp from "./logins/resendotp";
export default function App (){


  return(
<Router>
<Routes>
<Route path="/login" element={<Login />}/>
<Route path="/register" element={<Register />} />
<Route path="/verify-otp" element={<VerifyOtp />} />
<Route path="/resend-otp" element={<ResendOtp />} />

<Route element={<Layout />} >
<Route path="/"  element={<Home />} />
<Route path="store"  element={<Store />} />
<Route path="cart" element={<Cart />} />
<Route path="complete" element={<Success />} />
<Route path="wishlist" element={<Wish />} />
<Route path="order" element={<Order />} />
<Route path="payment" element={<Payment />} />
<Route path="products/:id" element={<Products />} />


</Route>
<Route path="/adminpanel" element={<Protect><Panel /></Protect>}>
  <Route path="dashboard" element={<Dash />}/>
  <Route path="orderdetails" element={<Orderdetails />}/>
  <Route path="userdetails" element={<User />} />
  <Route path="userdetails/order/:id" element={<Userorder />}/>
  <Route path="userdetails/wish/:id" element={<Userwhish />}/>
  <Route path="products" element={<Productss />}/>
  <Route path="orderhistory" element={<OrderHistory />}/>
  <Route path="edit/:id" element={<Edit />}/>
  <Route path="edit/create" element={<Edit />}/>
   
  
</Route>




<Route path="*" element={<Empty />} />



</Routes>


</Router>


  )
}