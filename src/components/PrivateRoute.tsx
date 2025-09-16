import { useSnackbar } from "notistack";
import { useEffect, type FC, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthState";

const PrivateRoute: FC<{ children?: ReactNode }> = ({ children }) => {
  const { isAuth, isLoading } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!isLoading && !isAuth) {
      navigate("/login");
      enqueueSnackbar("U bent niet ingelogd", { variant: "warning" });
    }
  }, [isAuth, isLoading]);

  return children;
};

export default PrivateRoute;
