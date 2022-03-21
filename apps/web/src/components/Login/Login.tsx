import { FC, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthState";
import { GoogleLogin } from "react-google-login";
import { useTheme } from "@mui/material";
import axios from "axios";
import { useAppState } from "../../context/AppState";

type FormData = {
  email: string;
  password: string;
};

const Login: FC = () => {
  const { handleSubmit, control, setError } = useForm<FormData>();
  const { user, googleLogin, checkAuth } = useAuth();
  const { apiUrl } = useAppState();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    if (user.auth) {
      navigate("/todos");
    }
  }, [user]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!data.email || !data.password) return;

      await axios.post(`${apiUrl}/auth/login`, {
        email: data.email,
        password: data.password,
      });
      checkAuth();
      navigate("/todos");
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
        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={{
            required: "Gelieve uw e-mail adres in te vullen.",
            pattern: {
              value:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: "Geef een correct email adres op",
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              error={!!error}
              helperText={error ? error.message : null}
              margin="dense"
              variant="outlined"
              label="E-mail adres"
              value={value}
              onChange={onChange}
              fullWidth
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          defaultValue=""
          rules={{
            required: "Gelieve uw wachtwoord in te vullen.",
            minLength: {
              value: 8,
              message: "Geef een wachtwoord op dat langer is dan 8 tekens.",
            },
            maxLength: {
              value: 256,
              message: "Geef een wachtwoord op dat korter is dan 256 tekens.",
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              error={!!error}
              helperText={error ? error.message : null}
              margin="dense"
              variant="outlined"
              type="password"
              label="Wachtwoord"
              value={value}
              onChange={onChange}
              fullWidth
            />
          )}
        />
        <Button sx={{ mt: 2 }} type="submit" fullWidth variant="contained" color="primary">
          Log in
        </Button>
        <GoogleLogin
          buttonText="Log in met Google"
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID ?? ""}
          onSuccess={googleLogin}
          theme="dark"
          className="google-login-button"
        />

        <Grid container>
          <Grid item>
            <Link to="/register">Geen account? Registreer</Link>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default Login;
