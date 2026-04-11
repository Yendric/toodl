import { CircularProgress, Stack } from "@mui/material";
import { type FC } from "react";

const LandingLoading: FC = () => {
  return (
    <Stack sx={{ alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <CircularProgress size={65} />
    </Stack>
  );
};

export default LandingLoading;
