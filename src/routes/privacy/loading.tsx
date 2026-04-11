import { CircularProgress, Container, Stack } from "@mui/material";
import { type FC } from "react";

const PrivacyLoading: FC = () => {
  return (
    <Container>
      <Stack sx={{ alignItems: "center", mt: 5 }}>
        <CircularProgress size={65} />
      </Stack>
    </Container>
  );
};

export default PrivacyLoading;
