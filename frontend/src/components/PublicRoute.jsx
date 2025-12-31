// components/PublicRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

export default function PublicRoute({ children }) {
  const { user, authLoading } = useContext(AuthContext);

  if (authLoading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  // If logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // If NOT logged in
  return children;
}
