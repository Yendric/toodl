import Delete from "@mui/icons-material/Delete";
import Save from "@mui/icons-material/Save";
import {
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useState, type FC } from "react";
import { Link } from "react-router";
import { useUserInfoSuspense, useUserUpdate } from "../../api/generated/toodl";
import { UserUpdateBody } from "../../api/generated/toodlApi.zod";
import { useZodForm } from "../../hooks/useZodForm";
import { ZodCheckbox } from "../Form/ZodCheckbox";
import { ZodTextField } from "../Form/ZodTextField";
import DeleteAccountModal from "./DeleteAccountModal";
import IcalInput from "./IcalInput";
import NotificationManager from "./NotificationManager";



const ProfileForm: FC = () => {
  const { data: user } = useUserInfoSuspense();
  const { enqueueSnackbar } = useSnackbar();
  const updateUserMutation = useUserUpdate({
    mutation: {
      onSuccess: () => {
        void enqueueSnackbar("Profiel opgeslagen", { variant: "success" });
      },
      onError: () => {
        void enqueueSnackbar("Opslaan mislukt", { variant: "error" });
      },
    },
  });

  const form = useZodForm(UserUpdateBody, {
    defaultValues: {
      email: user.email,
      username: user.username,
      icalUrls: user.icalUrls || [],
      dailyNotification: !!user.dailyNotification,
      reminderNotification: !!user.reminderNotification,
      nowNotification: !!user.nowNotification,
      dailyPush: !!user.dailyPush,
      reminderPush: !!user.reminderPush,
      nowPush: !!user.nowPush,
    },
    onSubmit: ({ value }) => {
      updateUserMutation.mutate({ data: value });
    },
  });

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <Card>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void form.handleSubmit();
        }}
        noValidate
      >
        <CardContent>
          <Typography variant="h5" component="h2">
            Jouw profiel
            <Button component={Link} to="/" variant="outlined" sx={{ ml: 1 }}>
              Keer terug
            </Button>
          </Typography>
        </CardContent>
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">Account</FormLabel>
                <form.Field name="username">
                  {(field) => (
                    <ZodTextField field={field} margin="normal" variant="outlined" label="Gebruikersnaam" fullWidth />
                  )}
                </form.Field>
                <form.Field name="email">
                  {(field) => (
                    <ZodTextField field={field} margin="normal" variant="outlined" label="E-mail adres" fullWidth />
                  )}
                </form.Field>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend">E-mail Notificaties</FormLabel>
                <FormGroup>
                  <form.Field name="dailyNotification">
                    {(field) => <FormControlLabel control={<ZodCheckbox field={field} />} label="Dag op voorhand" />}
                  </form.Field>
                  <form.Field name="reminderNotification">
                    {(field) => (
                      <FormControlLabel
                        control={<ZodCheckbox field={field} />}
                        label="Herinnering (~15 min op voorhand)"
                      />
                    )}
                  </form.Field>
                  <form.Field name="nowNotification">
                    {(field) => <FormControlLabel control={<ZodCheckbox field={field} />} label="Op het moment zelf" />}
                  </form.Field>
                </FormGroup>
              </FormControl>

              <FormControl component="fieldset" sx={{ mt: 2 }}>
                <FormLabel component="legend">Browser Push Notificaties</FormLabel>
                <NotificationManager />
                <FormGroup sx={{ mt: 1 }}>
                  <form.Field name="dailyPush">
                    {(field) => <FormControlLabel control={<ZodCheckbox field={field} />} label="Dag op voorhand" />}
                  </form.Field>
                  <form.Field name="reminderPush">
                    {(field) => (
                      <FormControlLabel
                        control={<ZodCheckbox field={field} />}
                        label="Herinnering (~15 min op voorhand)"
                      />
                    )}
                  </form.Field>
                  <form.Field name="nowPush">
                    {(field) => <FormControlLabel control={<ZodCheckbox field={field} />} label="Op het moment zelf" />}
                  </form.Field>
                </FormGroup>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <form.Field name="icalUrls">
                {(field) => (
                  <IcalInput
                    value={field.state.value}
                    onChange={(val) => field.handleChange(val)}
                    errors={field.state.meta.errors.map((e) => e?.message ?? "")}
                  />
                )}
              </form.Field>
            </Grid>
          </Grid>
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!canSubmit || isSubmitting}
                startIcon={<Save />}
              >
                {isSubmitting ? "Laden..." : "Opslaan"}
              </Button>
            )}
          </form.Subscribe>
          <Button
            variant="contained"
            sx={{ float: "right" }}
            color="error"
            onClick={() => setModalVisible(true)}
            startIcon={<Delete />}
          >
            Verwijder
          </Button>
          <DeleteAccountModal visible={modalVisible} onDismissed={() => setModalVisible(false)} />
        </CardContent>
      </form>
    </Card>
  );
};

export default ProfileForm;
