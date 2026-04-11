import { Box, Typography } from "@mui/material";
import { useRouteError } from "react-router";

export default function ErrorPage() {
  const error = useRouteError() as any;
  console.error(error);

  return (
    <Box
      id="error-page"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h1">Oeps!</Typography>
      <Typography variant="body1">Sorry, er is een onverwachte fout opgetreden.</Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mt: 2 }}>
        <i>{error.statusText || error.message}</i>
      </Typography>
    </Box>
  );
}
