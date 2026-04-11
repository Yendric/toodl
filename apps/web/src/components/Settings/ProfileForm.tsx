import { zodResolver } from "@hookform/resolvers/zod";
import Delete from "@mui/icons-material/Delete";
import Save from "@mui/icons-material/Save";
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  TextField,
  Typography
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useState, type FC } from "react";
import { Controller, useForm, type FieldError } from "react-hook-form";
import { Link } from "react-router";
import { z } from "zod";
import { useUserInfoSuspense, useUserUpdate } from "../../api/generated/toodl";
import DeleteAccountModal from "./DeleteAccountModal";
import IcalInput from "./IcalInput";

const schema = z.object({
  email: z.string().email().min(3).max(50).toLowerCase(),
  username: z.string().min(1).max(50),
  icalUrls: z.array(z.string().url()).max(10),
  dailyNotification: z.boolean(),
  reminderNotification: z.boolean(),
  nowNotification: z.boolean(),
});

const ProfileForm: FC = () => {
  const { data: user } = useUserInfoSuspense();
  const updateUserMutation = useUserUpdate();
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({ values: user, resolver: zodResolver(schema) });
  const { enqueueSnackbar } = useSnackbar();
  const [modalVisible, setModalVisible] = useState(false);

  const onSubmit = handleSubmit((data) => {
    updateUserMutation.mutate({ data });
  });

  return (
    <Card>
      <form onSubmit={onSubmit} noValidate>
        <CardContent>
          <Typography variant="h5" component="h2">
            Jouw profiel
            <Link to="/">
              <Button variant="outlined" sx={{ ml: 1 }}>
                Keer terug
              </Button>
            </Link>
          </Typography>
        </CardContent>
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">Account</FormLabel>
                <TextField
                  {...register("username")}
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  margin="normal"
                  variant="outlined"
                  label="Gebruikersnaam"
                  fullWidth
                />
                <TextField
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  margin="normal"
                  variant="outlined"
                  label="E-mail adres"
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Notificaties</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox defaultChecked={user.dailyNotification} {...register("dailyNotification")} />}
                    label="Dagelijks"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox defaultChecked={user.reminderNotification} {...register("reminderNotification")} />
                    }
                    label="Herinnering (~15 min op voorhand)"
                  />
                  <FormControlLabel
                    control={<Checkbox defaultChecked={user.nowNotification} {...register("nowNotification")} />}
                    label="Op het moment zelf"
                  />
                </FormGroup>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Controller
                name="icalUrls"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                  <IcalInput value={value} onChange={onChange} error={error as unknown as FieldError[]} />
                )}
              />
            </Grid>
          </Grid>
          <Button variant="contained" color="primary" type="submit" startIcon={<Save />}>
            Opslaan
          </Button>
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
