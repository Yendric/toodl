import { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppState } from "../context/AppState";
import { useAuth } from "../context/AuthState";

const PrivateRoute: FC<{ children?: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { isLoading } = useAppState();

  if (user.auth) {
    return <>{children}</>;
  } else if (!isLoading) {
    return <Navigate to="/login" />;
  } else {
    return <></>;
  }
};

export default PrivateRoute;
