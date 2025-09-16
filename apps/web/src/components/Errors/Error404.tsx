import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { type FC } from "react";

const Error404: FC = () => {
  return (
    <Box
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Typography variant="h1" color="textSecondary" align="center">
        Error 404
      </Typography>
      <Typography variant="h3" color="textSecondary" align="center">
        Deze pagina bestaat niet
      </Typography>
    </Box>
  );
};

export default Error404;
