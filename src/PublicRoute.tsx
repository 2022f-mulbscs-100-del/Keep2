import React from "react";
import { useAuth } from "./Context/AuthContext";
import { Navigate } from "react-router-dom";
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { userData, isLoading } = useAuth();
  return (
    <>{!isLoading && (userData !== null ? <Navigate to="/" /> : children)}</>
  );
};

export default PublicRoute;
