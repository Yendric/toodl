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
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAppState } from "../../context/AppState";
import { useAuth } from "../../context/AuthState";

type FormData = {
  email: string;
  username: string;
  smartschoolCourseExport: string;
  smartschoolTaskExport: string;
  dailyNotification: boolean;
  reminderNotification: boolean;
  nowNotification: boolean;
};

const Profile: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { apiUrl } = useAppState();
  const { user, deleteAccount } = useAuth();
  const { control, handleSubmit } = useForm<FormData>({ defaultValues: user });

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await axios.post(`${apiUrl}/auth/user_data`, data);
      enqueueSnackbar("Profiel geüpdatet");
    } catch {
      enqueueSnackbar("Er is iets fout gegaan", {
        variant: "error",
      });
    }
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
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">Account</FormLabel>
                <Controller
                  name="username"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Gelieve uw gebruikersnaam in te vullen.",
                    min: 5,
                    max: 30,
                  }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                      error={!!error}
                      helperText={error ? error.message : null}
                      margin="normal"
                      variant="outlined"
                      label="Gebruikersnaam"
                      value={value}
                      onChange={onChange}
                      fullWidth
                    />
                  )}
                />
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
                      margin="normal"
                      variant="outlined"
                      label="E-mail adres"
                      value={value}
                      onChange={onChange}
                      fullWidth
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Notificaties</FormLabel>
                <FormGroup>
                  <Controller
                    name="dailyNotification"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <FormControlLabel control={<Checkbox checked={value} onChange={onChange} />} label="Dagelijks" />
                    )}
                  />
                  <Controller
                    name="reminderNotification"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <FormControlLabel
                        control={<Checkbox checked={value} onChange={onChange} />}
                        label="Herinnering (~15 min op voorhand)"
                      />
                    )}
                  />
                  <Controller
                    name="nowNotification"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <FormControlLabel
                        control={<Checkbox checked={value} onChange={onChange} />}
                        label="Op het moment zelf"
                      />
                    )}
                  />
                </FormGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">Smartschool</FormLabel>
                <Controller
                  name="smartschoolCourseExport"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                      error={!!error}
                      helperText={error ? error.message : null}
                      margin="normal"
                      variant="outlined"
                      label="Lesonderwerpen"
                      value={value ?? ""}
                      onChange={onChange}
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="smartschoolTaskExport"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                      error={!!error}
                      helperText={error ? error.message : null}
                      margin="normal"
                      variant="outlined"
                      label="Taken en toetsen"
                      value={value ?? ""}
                      onChange={onChange}
                      fullWidth
                    />
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Button variant="contained" color="primary" type="submit" startIcon={<Save />}>
            Opslaan
          </Button>
          <Button variant="contained" sx={{ float: "right" }} color="error" onClick={handleOpen} startIcon={<Delete />}>
            Verwijder account
          </Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography variant="h6" component="h2">
                Weet u zeker dat u uw account wil verwijderen?
              </Typography>
              <Typography sx={{ mb: 2 }}>Deze actie kan niet ongedaan worden gemaakt</Typography>
              <Button variant="contained" sx={{ float: "left" }} onClick={handleClose}>
                Annuleer
              </Button>
              <Button variant="contained" sx={{ float: "right" }} color="error" onClick={deleteAccount}>
                Ja, verwijder
              </Button>
            </Box>
          </Modal>
        </CardContent>
      </form>
    </Card>
  );
};

export default Profile;
