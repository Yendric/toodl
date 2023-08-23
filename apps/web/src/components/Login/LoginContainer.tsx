import { zodResolver } from "@hookform/resolvers/zod";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useTheme } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { GoogleLogin } from "@react-oauth/google";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../../context/AuthState";

type FormData = {
  email: string;
  password: string;
};

const schema = z.object({
  email: z.string().email().min(3).max(50),
  password: z.string().min(8).max(50),
});

const LoginContainer: FC = () => {
  const {
    handleSubmit,
    setError,
    register,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const { googleLogin, isAuth, login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    if (isAuth) {
      navigate("/todos");
    }
  }, [isAuth]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await login(data);
    } catch {
      setError("email", { message: "Foutief wachtwoord of email adres" });
      setError("password", { message: "Foutief wachtwoord of email adres" });
    }
  });

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: theme.palette.primary.main }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Log in
      </Typography>
      <form onSubmit={onSubmit} noValidate>
        <TextField
          inputProps={register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          margin="dense"
          variant="outlined"
          label="E-mail adres"
          autoComplete="email"
          fullWidth
        />
        <TextField
          inputProps={register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
          margin="dense"
          variant="outlined"
          type="password"
          label="Wachtwoord"
          autoComplete="current-password"
          fullWidth
        />
        <Button sx={{ mt: 2 }} type="submit" fullWidth variant="contained" color="primary">
          Log in
        </Button>
        <div className="google-login-button">
          <GoogleLogin theme="filled_blue" onSuccess={googleLogin} />
        </div>
        <Grid container>
          <Grid item>
            <Link to="/register">Geen account? Registreer</Link>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default LoginContainer;
