import { Box } from "@mui/material";
import { type FC } from "react";
import PasswordForm from "../../components/Settings/PasswordForm";
import ProfileForm from "../../components/Settings/ProfileForm";

const Settings: FC = () => {
  return (
    <Box sx={{ mx: "auto", my: 2, px: 4, width: "90%" }}>
      <ProfileForm />
      <PasswordForm />
    </Box>
  );
};

export default Settings;
