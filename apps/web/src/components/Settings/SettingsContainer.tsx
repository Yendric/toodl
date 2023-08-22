import { Box } from "@mui/material";
import { FC } from "react";
import PasswordForm from "./PasswordForm";
import ProfileForm from "./ProfileForm";

const SettingsContainer: FC = () => {
  return (
    <Box mx="auto" my={2} width="90%">
      <ProfileForm />
      <PasswordForm />
    </Box>
  );
};

export default SettingsContainer;
