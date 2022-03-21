import { FC } from "react";
import { Navigate } from "react-router-dom";
import { useAppState } from "../context/AppState";
import { useAuth } from "../context/AuthState";

const PrivateRoute: FC<{ children: any }> = ({ children }) => {
  const { user } = useAuth();
  const { isLoading } = useAppState();
  return !isLoading && (user.auth ? children : <Navigate to="/login" />);
};

export default PrivateRoute;
