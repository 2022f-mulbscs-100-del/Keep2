import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "./Context/UserContext";
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { profileData: userData, isLoading } = useUser();
  return (
    <>
      {!isLoading && (userData?.email !== "" ? <Navigate to="/" /> : children)}
    </>
  );
};

export default PublicRoute;
