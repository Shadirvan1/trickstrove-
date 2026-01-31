import { useNavigate} from "react-router-dom";
import { useState } from "react";
import logapi from "../api/logapi";

export default function ResendOtp() {
  const [msg, setMsg] = useState("");
  const[data,setData]=useState("")
const navigate = useNavigate()
  const resend = async () => {
    try {
      await logapi.post("user/otp-resend/",{email:data});
      setMsg("OTP resent to email");
      localStorage.setItem('email',data)
      navigate('/verify-otp')
    } catch(err) {
      console.log(err.response.data)

      setMsg("Failed to resend OTP");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 shadow rounded space-y-4 w-96 text-center">

        <h2 className="text-xl font-bold">Resend OTP</h2>
        <input onChange={(e)=>setData(e.target.value)} type="email" placeholder="Enter your email" />
        <button onClick={resend} className="w-full bg-yellow-500 text-white p-2 rounded">
          Resend OTP
        </button>
        {msg && <p>{msg}</p>}
        <p onClick={()=>navigate('/register')}>Signup</p>
      </div>
    </div>
  );
}
