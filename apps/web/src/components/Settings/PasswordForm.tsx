import { zodResolver } from "@hookform/resolvers/zod";
import Security from "@mui/icons-material/Security";
import { Button, Card, CardContent, Divider, FormControl, Skeleton, TextField, Typography } from "@mui/material";
import { type FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUser } from "../../api/user/getUser";
import { useUpdatePassword } from "../../api/user/updatePassword";

const schema = z.object({
  newPassword: z.string().min(8).max(50),
  confirmPassword: z.string().min(8).max(50),
  oldPassword: z.string().min(8).max(50).optional(),
});

const PasswordForm: FC = () => {
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
  const { data: user, isSuccess } = useUser();
  const updatePasswordMutation = useUpdatePassword();
  const onSubmit = handleSubmit(async (data) => {
    reset();
    updatePasswordMutation.mutate({ ...data, ...user });
  });

  if (!isSuccess || !navigator.onLine) {
    return (
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h5" component="h2">
            Wachtwoord veranderen
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Verander je wachtwoord
          </Typography>
        </CardContent>
        <Divider />
        <CardContent>
          <FormControl component="fieldset" fullWidth sx={{ mt: -2 }}>
            <Skeleton height={90} />
            <Skeleton height={90} />
            <Skeleton height={90} />
          </FormControl>
          <Button variant="contained" color="primary" disabled startIcon={<Security />} sx={{ mt: 1 }}>
            Wachtwoord veranderen
          </Button>
        </CardContent>
      </Card>
    );
  }

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
                margin="dense"
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
              margin="dense"
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
              margin="dense"
              autoComplete="new-password"
              variant="outlined"
              label="Bevestig nieuw wachtwoord"
              type="password"
              fullWidth
            />
          </FormControl>
          <Button variant="contained" color="primary" type="submit" startIcon={<Security />} sx={{ mt: 1 }}>
            {user.onlyLinked ? "Wachtwoord instellen" : "Wachtwoord veranderen"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
};

export default PasswordForm;
