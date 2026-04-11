import { CircularProgress, Container, Stack } from "@mui/material";
import { type FC } from "react";

const RegisterLoading: FC = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Stack sx={{ alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <CircularProgress size={65} />
      </Stack>
    </Container>
  );
};

export default RegisterLoading;
