import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useTheme } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { GoogleLogin } from "@react-oauth/google";
import { useEffect, type FC } from "react";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { useAuth } from "../../context/AuthState";
import { useZodForm } from "../../hooks/useZodForm";
import { ZodTextField } from "../../components/Form/ZodTextField";

const schema = z.object({
  username: z.string().min(1, "Gebruikersnaam is verplicht").max(50),
  email: z.string().email("Ongeldig e-mail adres").min(3).max(50),
  password: z.string().min(8, "Wachtwoord moet minstens 8 tekens bevatten").max(50),
});

const Register: FC = () => {
  const { googleLogin, isAuth, register: registerUser } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const form = useZodForm(schema, {
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await registerUser(value);
      } catch {
        form.setFieldMeta("email", (prev) => ({
          ...prev,
          errorMap: { onChange: "Dit e-mail adres is al in gebruik" },
        }));
      }
    },
  });

  useEffect(() => {
    if (isAuth) {
      void navigate("/todos?newUser=true", { viewTransition: true });
    }
  }, [isAuth, navigate]);

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: theme.palette.primary.main }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Registreer
      </Typography>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        noValidate
      >
        <form.Field name="username">
          {(field) => (
            <ZodTextField
              field={field}
              margin="dense"
              variant="outlined"
              label="Gebruikersnaam"
              autoComplete="username"
              fullWidth
            />
          )}
        </form.Field>
        <form.Field name="email">
          {(field) => (
            <ZodTextField
              field={field}
              margin="dense"
              variant="outlined"
              label="E-mail adres"
              autoComplete="email"
              fullWidth
            />
          )}
        </form.Field>
        <form.Field name="password">
          {(field) => (
            <ZodTextField
              field={field}
              margin="dense"
              variant="outlined"
              type="password"
              label="Wachtwoord"
              autoComplete="current-password"
              fullWidth
            />
          )}
        </form.Field>
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button
              sx={{ mt: 2 }}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? "Laden..." : "Registreer"}
            </Button>
          )}
        </form.Subscribe>

        <Grid container sx={{ mt: 1 }}>
          <Grid>
            <Link to="/login" viewTransition>
              Reeds een account? Log in
            </Link>
          </Grid>
        </Grid>
        <hr />
        <div className="google-login-button">
          <GoogleLogin
            theme="filled_blue"
            onSuccess={(res) => {
              void googleLogin(res);
            }}
          />
        </div>
      </form>
    </Container>
  );
};

export default Register;
