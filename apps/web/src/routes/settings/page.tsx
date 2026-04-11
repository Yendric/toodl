import { Box } from "@mui/material";
import { type FC } from "react";
import PrivateRoute from "../../components/PrivateRoute";
import PasswordForm from "../../components/Settings/PasswordForm";
import ProfileForm from "../../components/Settings/ProfileForm";
import Sidebar from "../../components/Sidebar/Sidebar";
import { CurrentListProvider } from "../../context/CurrentListState";

const Settings: FC = () => {
  return (
    <PrivateRoute>
      <CurrentListProvider>
        <Box sx={{ display: "flex" }}>
          <Sidebar />
          <Box sx={{ mx: "auto", my: 2, px: 4, width: "90%" }}>
            <ProfileForm />
            <PasswordForm />
          </Box>
        </Box>
      </CurrentListProvider>
    </PrivateRoute>
  );
};

export default Settings;
