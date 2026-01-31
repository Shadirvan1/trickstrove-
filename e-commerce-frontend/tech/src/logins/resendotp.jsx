import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logapi from "../api/logapi";

export default function ResendOtp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const resend = async () => {
    setMsg("");
    setLoading(true);

    try {
      await logapi.post("user/otp-resend/", { email });
      localStorage.setItem("email", email);
      setMsg("OTP resent to your email 📧");
      navigate("/verify-otp");
    } catch (err) {
      setMsg("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-200 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl space-y-5 text-center">
        <h2 className="text-3xl font-bold text-gray-800">
          Resend OTP 🔁
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />

        <button
          onClick={resend}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-white font-semibold transition
            ${loading
              ? "bg-yellow-400 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-600"}
          `}
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {loading ? "Sending OTP..." : "Resend OTP"}
        </button>

        {msg && (
          <p
            className={`text-sm ${
              msg.includes("resent")
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {msg}
          </p>
        )}

        <button
          onClick={() => navigate("/register")}
          className="text-sm text-yellow-700 hover:underline"
        >
          Back to Signup
        </button>
      </div>
    </div>
  );
}
