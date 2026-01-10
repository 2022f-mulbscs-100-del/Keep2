import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "./Context/UserContext";
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { profileData: userData, isLoading } = useUser();
  console.log("PublicRoute - isLoading:", isLoading, "userData:", userData);
  return (
    <>
      {!isLoading && (userData?.email !== "" ? <Navigate to="/" /> : children)}
    </>
  );
};

export default PublicRoute;
