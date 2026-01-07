import { Navigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { userData, isLoading } = useAuth();
  return (
    <>
      {!isLoading && (userData !== null ? children : <Navigate to="/login" />)}
    </>
  );
};

export default ProtectedRoute;
