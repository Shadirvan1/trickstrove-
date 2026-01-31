import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logapi from "../api/logapi";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const email = localStorage.getItem("email")
  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await logapi.post("user/otp-verification/", {
        email:email,
        otp,
      });
      navigate("/login");
    } catch (err) {
      console.log(err)
      setMsg("Invalid or expired OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleVerify} className="bg-white p-8 rounded-xl shadow-md w-96 space-y-4">
        <h2 className="text-xl font-bold text-center">Verify OTP</h2>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
          Verify
        </button>
        <p className="text-sm text-center text-blue-600 cursor-pointer" onClick={()=>navigate("/resend-otp")}>
          Resend OTP
        </p>
        {msg && <p className="text-red-500 text-sm">{msg}</p>}
      </form>
    </div>
  );
}
