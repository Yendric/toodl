import { zodResolver } from "@hookform/resolvers/zod";
import Delete from "@mui/icons-material/Delete";
import Save from "@mui/icons-material/Save";
import {
  Box,
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
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { FC, useState } from "react";
import { Controller, FieldError, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useUser } from "../../api/user/getUser";
import { useUpdateUser } from "../../api/user/updateUser";
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
  const { data: user, isSuccess } = useUser();
  const updateUserMutation = useUpdateUser();
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({ values: user, resolver: zodResolver(schema) });
  const { enqueueSnackbar } = useSnackbar();
  const [modalVisible, setModalVisible] = useState(false);

  const onSubmit = handleSubmit((data) => {
    if (!isSuccess) return enqueueSnackbar("Er is iets foutgegaan", { variant: "error" });
    updateUserMutation.mutate({ ...user, ...data });
  });

  if (!isSuccess || !navigator.onLine) {
    return (
      <Card>
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
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">Account</FormLabel>
                <Skeleton height={80} />
                <Skeleton height={80} />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Notificaties</FormLabel>
                <FormGroup>
                  <Skeleton height={50} width={100} />
                  <Skeleton height={50} width={200} />
                  <Skeleton height={50} width={150} />
                </FormGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Box sx={{ mb: 2, mt: -2 }}>
                <FormLabel component="legend" sx={{ mb: 1 }}>
                  iCal-kalenders van derden importeren
                  <Button variant="contained" size="small" sx={{ ml: 1 }} disabled>
                    iCal-URL Toevoegen
                  </Button>
                </FormLabel>

                <FormGroup>
                  <Skeleton height={50} />
                  <Skeleton height={50} />
                  <Skeleton height={50} />
                </FormGroup>
              </Box>
            </Grid>
          </Grid>
          <Button variant="contained" color="primary" disabled startIcon={<Save />}>
            Opslaan
          </Button>
          <Button variant="contained" sx={{ float: "right" }} color="error" startIcon={<Delete />} disabled>
            Verwijder
          </Button>
        </CardContent>
      </Card>
    );
  }

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
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">Account</FormLabel>
                <TextField
                  inputProps={register("username")}
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  margin="normal"
                  variant="outlined"
                  label="Gebruikersnaam"
                  fullWidth
                />
                <TextField
                  inputProps={register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  margin="normal"
                  variant="outlined"
                  label="E-mail adres"
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={12}>
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
