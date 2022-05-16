import { LinearProgress } from "@mui/material";
import { FC } from "react";
import { useAppState } from "../../context/AppState";

const LoadingBar: FC = () => {
  const { isLoading } = useAppState();
  return isLoading ? <LinearProgress sx={{ position: "relative" }}></LinearProgress> : <></>;
};

export default LoadingBar;
