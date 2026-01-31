import { BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Login from './logins/login';
import Register from './logins/registration';
import Home from "./userpages/homepage/home";
import Products from "./userpages/product/product";
import Cart from "./userpages/cart/cart";
import Success from "./userpages/order/success";
import Empty from "./muliple";
import Layout from "./navbar/layout";

import Order from "./userpages/order/order";
import Protect from './logins/prroute'
import Panel from './adminpages/dashboard/adminpanel'
import Dash from "./adminpages/dashboard/dashboard";
import Orderdetails from "./adminpages/ordermanage/orderdetails"
import User from "./adminpages/usermanage/userdetails";
import Userorder from "./adminpages/usermanage/userproducts";
import Productss from "./adminpages/productmanage/productss";
import Edit from "./adminpages/productmanage/edit";
import Payment from "./userpages/address/payment"
import PaymentPage from "./userpages/order/order_payment";
import CreateProduct from "./adminpages/productmanage/createproduct";
import VerifyOtp from "./logins/otp_verify";
import ResendOtp from "./logins/resendotp";
import EditUser from "./adminpages/usermanage/edituser";
import ProtectedRoute from "./logins/loginprotoctor";
export default function App (){


return(
<Router>
<Routes>
<Route path="/login" element={<ProtectedRoute><Login /></ProtectedRoute>}/>
<Route path="/register" element={<Register />} />
<Route path="/verify-otp" element={<VerifyOtp />} />
<Route path="/resend-otp" element={<ResendOtp />} />

<Route element={<Layout />} >

<Route path="/"  element={<Home />} />
<Route path="cart" element={<Cart />} />
<Route path="complete" element={<Success />} />
<Route path="orders" element={<Order />} />
<Route path="payment" element={<Payment />} />
<Route path="paymentpage" element={<PaymentPage />} />
<Route path="products/:id" element={<Products />} />


</Route>
<Route path="/adminpanel" element={<Protect><Panel /></Protect>}>
  <Route path="dashboard" element={<Dash />}/>
  <Route path="orderdetails" element={<Orderdetails />}/>
  <Route path="userdetails" element={<User />} />
  <Route path="userdetails/order/:id" element={<Userorder />}/>
  <Route path="userdetails/edituser/:id" element={<EditUser />}/>
  <Route path="products" element={<Productss />}/>
  <Route path="edit/:id" element={<Edit />}/>
  <Route path="createproduct" element={<CreateProduct />}/>
  <Route path="edit/create" element={<Edit />}/>
   
  
</Route>




<Route path="*" element={<Empty />} />



</Routes>


</Router>


  )
}