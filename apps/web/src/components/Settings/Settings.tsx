import { FC } from "react";
import Profile from "./Profile";
import Password from "./Password";
import { Box } from "@mui/material";

const Settings: FC = () => {
  return (
    <Box mx="auto" my={2} width="90%">
      <Profile />
      <Password />
    </Box>
  );
};

export default Settings;
