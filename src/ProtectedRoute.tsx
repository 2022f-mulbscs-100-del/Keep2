import { Navigate } from "react-router-dom";
import { useUser } from "./Context/UserContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { userData, isLoading } = useUser();
  console.log("ProtectedRoute - userData:", userData);
  console.log("ProtectedRoute - isLoading:", isLoading);
  return <>{!isLoading && (userData ? children : <Navigate to="/login" />)}</>;
};

export default ProtectedRoute;
