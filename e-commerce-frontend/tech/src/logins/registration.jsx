import { useState } from "react";
import logapi from "../api/logapi";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    phone_number: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (formData.password !== formData.password2) {
      return setErrors({ password2: ["Passwords do not match"] });
    }

    try {
      setLoading(true);
      await logapi.post("user/register/", formData);
      localStorage.setItem("email", formData.email);
      navigate("/verify-otp");
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ general: ["Registration failed. Please try again."] });
      }
    } finally {
      setLoading(false);
    }
  };

  const fields = ["username", "email", "phone_number", "password", "password2"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl space-y-5"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Create Account ✨
        </h2>

        {fields.map((field, i) => (
          <div key={i}>
            <input
              type={field.includes("password") ? "password" : "text"}
              name={field}
              placeholder={field.replace("_", " ")}
              value={formData[field]}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition ${
                errors[field]
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-indigo-400"
              }`}
            />
            {errors[field] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[field][0]}
              </p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-white font-semibold transition
            ${loading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"}
          `}
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {loading ? "Creating account..." : "Register"}
        </button>

        {errors.non_field_errors && (
          <p className="text-red-500 text-sm text-center">
            {errors.non_field_errors[0]}
          </p>
        )}

        {errors.general && (
          <p className="text-red-500 text-sm text-center">
            {errors.general[0]}
          </p>
        )}

        <div className="flex justify-between text-sm text-gray-600 pt-2">
          <button
            type="button"
            onClick={() => navigate("/verify-otp")}
            className="text-indigo-600 hover:underline"
          >
            Verify OTP
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-indigo-600 hover:underline"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
