import { useState } from "react";
import logapi from "../api/logapi";
import { NavLink, useNavigate } from "react-router-dom";

export default function Login() {
  const [data, setData] = useState({ username: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await logapi.post("user/login/", data);

      localStorage.setItem("access_token", res.data.user.access);
      localStorage.setItem("refresh", res.data.user.refresh);
      localStorage.setItem("email", res.data.user.email);
      localStorage.setItem("user_id", res.data.user.user_id);

      if (res.data.user.isAdmin) {
        localStorage.setItem("isAdmin", res.data.user.isAdmin);
        navigate("/adminpanel/dashboard");
      } else {
        navigate("/");
      }

      setMsg("Login successful 🎉");
    } catch {
      setMsg("Invalid credentials or email not verified");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 px-4">
      <form
        onSubmit={login}
        className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl space-y-5"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Welcome Back 👋
        </h2>

        <div className="space-y-3">
          <input
            name="username"
            placeholder="Username"
            onChange={(e) =>
              setData({ ...data, username: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={(e) =>
              setData({ ...data, password: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-white font-semibold transition
            ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
          `}
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {loading ? "Logging in..." : "Login"}
        </button>

        {msg && (
          <p
            className={`text-sm text-center ${
              msg.includes("successful")
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {msg}
          </p>
        )}

        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <NavLink
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Register
          </NavLink>
        </p>
      </form>
    </div>
  );
}
