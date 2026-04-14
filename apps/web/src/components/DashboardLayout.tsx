import { Box } from "@mui/material";
import { type FC } from "react";
import { Outlet } from "react-router";
import PrivateRoute from "./PrivateRoute";
import Sidebar from "./Sidebar/Sidebar";
import { CurrentListProvider } from "../context/CurrentListState";

const DashboardLayout: FC = () => {
  return (
    <PrivateRoute>
      <CurrentListProvider>
        <Box sx={{ display: "flex" }}>
          <Sidebar />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              width: "100%",
              viewTransitionName: "main-content",
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </CurrentListProvider>
    </PrivateRoute>
  );
};

export default DashboardLayout;
