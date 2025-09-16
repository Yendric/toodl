import { Box } from "@mui/material";
import { type FC } from "react";
import Sidebar from "../Sidebar/Sidebar";
import PasswordForm from "./PasswordForm";
import ProfileForm from "./ProfileForm";

const SettingsContainer: FC = () => {
  return (
    <Box sx={{ display: "flex" }}>

      <Sidebar />
      <Box mx="auto" my={2} px={4} width="90%">
        <ProfileForm />
        <PasswordForm />
      </Box>
    </Box>
  );
};

export default SettingsContainer;
