import { useSnackbar } from "notistack";
import { useEffect, type FC, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthState";
import TodosLoading from "../routes/todos/loading";

const PrivateRoute: FC<{ children?: ReactNode }> = ({ children }) => {
  const { isAuth, isLoading } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!isLoading && !isAuth) {
      void navigate("/login", { viewTransition: true });
      enqueueSnackbar("U bent niet ingelogd", { variant: "warning" });
    }
  }, [isAuth, isLoading, navigate, enqueueSnackbar]);

  if (isLoading) {
    return <TodosLoading />;
  }

  if (!isAuth) {
    return null;
  }

  return children;
};

export default PrivateRoute;
