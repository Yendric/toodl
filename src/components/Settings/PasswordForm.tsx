import { Button, CardContent, Divider, FormControl, TextField, Typography, Card } from "@mui/material";
import Security from "@mui/icons-material/Security";
import { useSnackbar } from "notistack";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthState";
import useAxios from "../../hooks/useAxios";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import joiMessages from "../../helpers/joiMessages";

type FormData = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const schema = Joi.object({
  oldPassword: Joi.string().min(8).max(50).required(),
  newPassword: Joi.string().min(8).max(50).required(),
  confirmPassword: Joi.string().min(8).max(50).required(),
}).messages(joiMessages);

const PasswordForm: FC = () => {
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<FormData>({ resolver: joiResolver(schema) });
  const { enqueueSnackbar } = useSnackbar();
  const { user, checkAuth } = useAuth();
  const axios = useAxios();

  const onSubmit = handleSubmit(async (data) => {
    await axios.post("/auth/user_data/update_password", {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    });
    checkAuth();
    reset();
    enqueueSnackbar("Wachtwoord geüpdatet");
  });

  return (
    <Card sx={{ mt: 2 }}>
      <form onSubmit={onSubmit} noValidate>
        <input autoComplete="email" name="email" type="text" value={user.email} hidden readOnly />
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
              <TextField
                inputProps={register("oldPassword")}
                error={!!errors.oldPassword}
                helperText={errors.oldPassword?.message}
                margin="normal"
                variant="outlined"
                label="Oud wachtwoord"
                autoComplete="old-password"
                type="password"
                fullWidth
              />
            )}
            <TextField
              inputProps={register("newPassword")}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
              margin="normal"
              autoComplete="new-password"
              variant="outlined"
              label="Nieuw wachtwoord"
              type="password"
              fullWidth
            />
            <TextField
              inputProps={register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              margin="normal"
              autoComplete="new-password"
              variant="outlined"
              label="Bevestig nieuw wachtwoord"
              type="password"
              fullWidth
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

export default PasswordForm;
