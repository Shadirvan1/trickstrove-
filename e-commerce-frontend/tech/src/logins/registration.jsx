import { useState } from "react";
import logapi from "../api/logapi";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
 const [msg,setMsg]=useState()
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
      await logapi.post("user/register/", formData);
      localStorage.setItem("email", formData.email);
      navigate("/verify-otp");
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data); 
      } else {
        setErrors({ general: ["Registration failed. Please try again."] });
      }
    }
  };

  const fields = ["username", "email", "phone_number", "password", "password2"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Create Account
        </h2>

        {fields.map((field, i) => (
          <div key={i}>
            <input
              type={field.includes("password") ? "password" : "text"}
              name={field}
              placeholder={field.replace("_", " ")}
              value={formData[field]}
              onChange={handleChange}
              className={`w-full p-2 rounded border focus:outline-none focus:ring-2 ${
                errors[field]
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-indigo-300"
              }`}
            />
            {errors[field] && (
              <p className="text-red-500 text-sm mt-1">{errors[field][0]}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition"
        >
          Register
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
      <h3 onClick={()=>navigate('/verify-otp')} >Verify otp</h3>
      <h3 onClick={()=>navigate('/login')} >Login</h3>
      </form>
    </div>
  );
}
