import { Button, CardContent, Divider, FormControl, TextField, Typography, Card } from "@mui/material";
import Security from "@mui/icons-material/Security";
import { useSnackbar } from "notistack";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAppState } from "../../context/AppState";
import { useAuth } from "../../context/AuthState";
import axios, { AxiosError } from "axios";

type FormData = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const Password: FC = () => {
  const { handleSubmit, control, reset } = useForm<FormData>();
  const { enqueueSnackbar } = useSnackbar();
  const { apiUrl } = useAppState();
  const { user, checkAuth } = useAuth();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await axios.post(`${apiUrl}/auth/user_data/update_password`, {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      checkAuth();
      reset();
      enqueueSnackbar("Wachtwoord geüpdatet");
    } catch (error) {
      if (error instanceof AxiosError) {
        enqueueSnackbar(error.response?.data.message ?? "Er is iets foutgegaan", {
          variant: "error",
        });
      }
    }
  });

  return (
    <Card sx={{ mt: 2 }}>
      <form onSubmit={onSubmit} noValidate>
        <CardContent>
          <Typography variant="h5" component="h2">
            Wachtwoord {user.onlyLinked ? "instellen" : "veranderen"}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {user.onlyLinked
              ? "Momenteel heeft dit account geen wachtwoord en kan je enkel aanmelden via Google, je kan echter ook een wachtwoord instellen."
              : "Verander je wachtwoord"}
          </Typography>
        </CardContent>
        <Divider />
        <CardContent>
          <FormControl component="fieldset" fullWidth sx={{ mt: -2 }}>
            {!user.onlyLinked && (
              <Controller
                name="oldPassword"
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
                    margin="normal"
                    variant="outlined"
                    label="Oud wachtwoord"
                    type="password"
                    value={value}
                    onChange={onChange}
                    fullWidth
                  />
                )}
              />
            )}
            <Controller
              name="newPassword"
              control={control}
              defaultValue=""
              rules={{
                required: "Gelieve een nieuw wachtwoord in te vullen.",
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
                  margin="normal"
                  variant="outlined"
                  label="Nieuw wachtwoord"
                  type="password"
                  value={value}
                  onChange={onChange}
                  fullWidth
                />
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              defaultValue=""
              rules={{
                required: "Bevestig uw wachtwoord",
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
                  margin="normal"
                  variant="outlined"
                  label="Bevestig nieuw wachtwoord"
                  type="password"
                  value={value}
                  onChange={onChange}
                  fullWidth
                />
              )}
            />
          </FormControl>

          <Button variant="contained" color="primary" type="submit" startIcon={<Security />}>
            {user.onlyLinked ? "Wachtwoord instellen" : "Wachtwoord veranderen"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
};

export default Password;
