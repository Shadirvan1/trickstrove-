import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logapi from "../api/logapi";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const email = localStorage.getItem("email");

  const handleVerify = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      await logapi.post("user/otp-verification/", {
        email: email,
        otp,
      });
      navigate("/login");
    } catch (err) {
      setMsg("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-200 px-4">
      <form
        onSubmit={handleVerify}
        className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl space-y-5"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Verify OTP 🔐
        </h2>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-white font-semibold transition
            ${loading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"}
          `}
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/resend-otp")}
          className="block mx-auto text-sm text-green-700 hover:underline"
        >
          Resend OTP
        </button>

        {msg && (
          <p className="text-red-500 text-sm text-center">
            {msg}
          </p>
        )}
      </form>
    </div>
  );
}
