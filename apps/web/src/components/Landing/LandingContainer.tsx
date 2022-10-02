import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import { FC, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthState";

const LandingContainer: FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.auth) {
      navigate("/todos");
    }
  }, [user]);

  const images = [
    "https://unsplash.com/photos/2JknzBYDu6k/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjY0NzI2OTc3&force=true&w=2400",
    "https://unsplash.com/photos/vJ8c4BKaqWE/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjY0NzI2OTg2&force=true&w=2400",
    "https://unsplash.com/photos/RLw-UC03Gwc/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjY0NzI2OTYx&force=true&w=2400",
    "https://unsplash.com/photos/2Kqhw3qST0o/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjY0NzI2OTY2&force=true&w=2400",
  ];
  const image = images[Math.floor(Math.random() * images.length)];

  return (
    <div
      style={{
        background: `url(${image})`,
        height: "100%",
        position: "relative",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Card
        sx={{
          minWidth: 275,
          maxWidth: 600,
          position: "absolute",
          transform: "translate(-50%, -50%)",
          top: "50%",
          left: "50%",
          margin: 0,
        }}
      >
        <CardContent>
          <Typography variant="h5" component="div">
            Toodl
          </Typography>
          <Typography variant="body2">
            Maak een planning of todolijstje in slechts een paar klikken. Altijd beschikbaar op al uw apparaten!
          </Typography>
        </CardContent>
        <CardActions>
          <Link to="/login">
            <Button>Aan de slag!</Button>
          </Link>
        </CardActions>
      </Card>
    </div>
  );
};

export default LandingContainer;
