import { Box, Container, Link, Typography, useTheme } from "@mui/material";

export default function Footer() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[200],
        padding: theme.spacing(3, 2),
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          Toodl Planningmaker
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center">
          {"Copyright © "}
          <Link target="_blank" rel="noreferrer" color="inherit" href="https://yendric.be">
            Yendric Van Roey
          </Link>
          {" " + new Date().getFullYear()}
        </Typography>
      </Container>
    </Box>
  );
}
