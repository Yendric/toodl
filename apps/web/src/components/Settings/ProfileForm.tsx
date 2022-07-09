import { joiResolver } from "@hookform/resolvers/joi";
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
  Typography,
} from "@mui/material";
import Joi from "joi";
import { useSnackbar } from "notistack";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthState";
import joiMessages from "../../helpers/joiMessages";
import useAxios from "../../hooks/useAxios";
import DeleteAccountModal from "./DeleteAccountModal";

type FormData = {
  email: string;
  username: string;
  smartschoolCourseExport: string;
  smartschoolTaskExport: string;
  dailyNotification: boolean;
  reminderNotification: boolean;
  nowNotification: boolean;
};

const schema = Joi.object({
  username: Joi.string().max(50).required(),
  email: Joi.string().email({ tlds: false }).max(50).required(),
  smartschoolCourseExport: Joi.string()
    .uri()
    .min(80)
    .max(90)
    .regex(/smartschool.be/)
    .optional()
    .allow(null)
    .allow(""),
  smartschoolTaskExport: Joi.string()
    .uri()
    .min(80)
    .max(90)
    .regex(/smartschool.be/)
    .optional()
    .allow(null)
    .allow(""),
})
  .messages(joiMessages)
  .unknown(true);

const ProfileForm: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { user, checkAuth } = useAuth();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({ defaultValues: user, resolver: joiResolver(schema) });
  const axios = useAxios();

  const [modalVisible, setModalVisible] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    await axios.post("/auth/user_data", data);
    checkAuth();
    enqueueSnackbar("Profiel geüpdatet");
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
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">Smartschool</FormLabel>
                <TextField
                  inputProps={register("smartschoolCourseExport")}
                  error={!!errors.smartschoolCourseExport}
                  helperText={errors.smartschoolCourseExport?.message}
                  margin="normal"
                  variant="outlined"
                  label="Lesonderwerpen"
                  fullWidth
                />
                <TextField
                  inputProps={register("smartschoolTaskExport")}
                  error={!!errors.smartschoolTaskExport}
                  helperText={errors.smartschoolTaskExport?.message}
                  margin="normal"
                  variant="outlined"
                  label="Taken en toetsen"
                  fullWidth
                />
              </FormControl>
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
