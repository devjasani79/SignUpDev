// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
