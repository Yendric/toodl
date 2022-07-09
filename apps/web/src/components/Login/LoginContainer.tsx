import { FC, useEffect, useRef, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthState";
import { useTheme } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import useAxios from "../../hooks/useAxios";
import { useSnackbar } from "notistack";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import joiMessages from "../../helpers/joiMessages";

type FormData = {
  email: string;
  password: string;
};

const schema = Joi.object({
  email: Joi.string().email({ tlds: false }).required(),
  password: Joi.string().min(8).max(50).required(),
}).messages(joiMessages);

const LoginContainer: FC = () => {
  const {
    handleSubmit,
    setError,
    register,
    formState: { errors },
  } = useForm<FormData>({ resolver: joiResolver(schema) });
  const widthRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState("200");
  const { user, googleLogin, checkAuth } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const axios = useAxios();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (user.auth) {
      navigate("/todos");
    }
  }, [user]);

  useEffect(() => {
    setWidth(widthRef.current?.clientWidth.toString() ?? "200");
  }, [widthRef]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!data.email || !data.password) return;

      await axios.post("/auth/login", {
        email: data.email,
        password: data.password,
      });
      checkAuth();
      enqueueSnackbar("Succesvol ingelogd");
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
        <div ref={widthRef}>
          <Button sx={{ mt: 2 }} type="submit" fullWidth variant="contained" color="primary">
            Log in
          </Button>
        </div>
        <div className="google-login-button">
          <GoogleLogin theme="filled_blue" onSuccess={googleLogin} width={width} />
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
