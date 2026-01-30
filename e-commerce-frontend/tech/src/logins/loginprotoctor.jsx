import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access_token");
  const isAdmin = localStorage.getItem("isAdmin") === "true"; 
  
  if (token) {
    if (isAdmin) {
      return <Navigate to="/adminpanel/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}
