import Security from "@mui/icons-material/Security";
import { Button, Card, CardContent, Divider, FormControl, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { type FC } from "react";
import { useUserInfoSuspense, useUserUpdatePassword } from "../../api/generated/toodl";
import { UserUpdatePasswordBody } from "../../api/generated/toodlApi.zod";
import { useZodForm } from "../../hooks/useZodForm";
import { ZodTextField } from "../Form/ZodTextField";

const schema = UserUpdatePasswordBody.refine((data) => data.newPassword === data.confirmPassword, {
  message: "Wachtwoorden komen niet overeen",
  path: ["confirmPassword"],
});

const PasswordForm: FC = () => {
  const { data: user } = useUserInfoSuspense();
  const { enqueueSnackbar } = useSnackbar();
  const updatePasswordMutation = useUserUpdatePassword({
    mutation: {
      onSuccess: () => {
        void enqueueSnackbar("Wachtwoord aangepast", { variant: "success" });
        form.reset();
      },
      onError: () => {
        void enqueueSnackbar("Wachtwoord aanpassen mislukt", { variant: "error" });
      },
    },
  });

  const form = useZodForm(schema, {
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
      oldPassword: "",
    },
    onSubmit: ({ value }) => {
      updatePasswordMutation.mutate({
        data: {
          newPassword: value.newPassword,
          confirmPassword: value.confirmPassword,
          oldPassword: value.oldPassword || undefined,
        },
      });
    },
  });

  return (
    <Card sx={{ mt: 2 }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        noValidate
      >
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
              <form.Field name="oldPassword">
                {(field) => (
                  <ZodTextField
                    field={field}
                    margin="dense"
                    variant="outlined"
                    label="Oud wachtwoord"
                    autoComplete="old-password"
                    type="password"
                    fullWidth
                  />
                )}
              </form.Field>
            )}
            <form.Field name="newPassword">
              {(field) => (
                <ZodTextField
                  field={field}
                  margin="dense"
                  autoComplete="new-password"
                  variant="outlined"
                  label="Nieuw wachtwoord"
                  type="password"
                  fullWidth
                />
              )}
            </form.Field>
            <form.Field name="confirmPassword">
              {(field) => (
                <ZodTextField
                  field={field}
                  margin="dense"
                  autoComplete="new-password"
                  variant="outlined"
                  label="Bevestig nieuw wachtwoord"
                  type="password"
                  fullWidth
                />
              )}
            </form.Field>
          </FormControl>
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!canSubmit || isSubmitting}
                startIcon={<Security />}
                sx={{ mt: 1 }}
              >
                {isSubmitting ? "Laden..." : user.onlyLinked ? "Wachtwoord instellen" : "Wachtwoord veranderen"}
              </Button>
            )}
          </form.Subscribe>
        </CardContent>
      </form>
    </Card>
  );
};

export default PasswordForm;
