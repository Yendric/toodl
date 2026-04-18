import { Box } from "@mui/material";
import { type FC } from "react";
import PasswordForm from "../../components/Settings/PasswordForm";
import ProfileForm from "../../components/Settings/ProfileForm";

const Settings: FC = () => {
  return (
    <Box sx={{ mx: "auto", my: 2, px: { xs: 2, sm: 4 }, width: { xs: "100%", sm: "90%" } }}>
      <ProfileForm />
      <PasswordForm />
    </Box>
  );
};

export default Settings;
