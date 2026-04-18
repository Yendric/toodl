import { useSnackbar } from "notistack";
import { useEffect, type FC, type ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthState";
import TodosLoading from "../routes/todos/loading";

const PrivateRoute: FC<{ children?: ReactNode }> = ({ children }) => {
  const { isAuth, isLoading } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!isLoading && !isAuth) {
      enqueueSnackbar("U bent niet ingelogd", { variant: "warning" });
    }
  }, [isAuth, isLoading, enqueueSnackbar]);

  if (isLoading) {
    return <TodosLoading />;
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
