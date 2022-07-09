import { FC } from "react";
import ProfileForm from "./ProfileForm";
import PasswordForm from "./PasswordForm";
import { Box } from "@mui/material";

const SettingsContainer: FC = () => {
  return (
    <Box mx="auto" my={2} width="90%">
      <ProfileForm />
      <PasswordForm />
    </Box>
  );
};

export default SettingsContainer;
