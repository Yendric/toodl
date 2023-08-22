import { useSnackbar } from "notistack";
import { FC, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthState";
import { CurrentListProvider } from "../context/CurrentListState";

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

  return <CurrentListProvider>{children}</CurrentListProvider>;
};

export default PrivateRoute;
