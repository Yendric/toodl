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
  username: string;
  email: string;
  password: string;
};

const schema = z.object({
  username: z.string().min(1).max(50),
  email: z.string().email().min(3).max(50),
  password: z.string().min(8).max(50),
});

const RegisterContainer: FC = () => {
  const {
    handleSubmit,
    setError,
    register,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const { googleLogin, isAuth, register: registerUser } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    if (isAuth) {
      navigate("/todos?newUser=true");
    }
  }, [isAuth]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await registerUser(data);
    } catch {
      setError("email", { message: "Dit e-mail adres is al in gebruik" });
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
        Registreer
      </Typography>
      <form onSubmit={onSubmit} noValidate>
        <TextField
          inputProps={register("username")}
          error={!!errors.username}
          helperText={errors.username?.message}
          margin="dense"
          variant="outlined"
          label="Gebruikersnaam"
          autoComplete="username"
          fullWidth
        />
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
          Registreer
        </Button>
        <div className="google-login-button">
          <GoogleLogin theme="filled_blue" onSuccess={googleLogin} />
        </div>
        <Grid container>
          <Grid item>
            <Link to="/login">Reeds een account? Log in</Link>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default RegisterContainer;
