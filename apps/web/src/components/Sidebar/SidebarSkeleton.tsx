import AddCircleIcon from "@mui/icons-material/AddCircle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Skeleton, Typography } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { type FC } from "react";

const SidebarSkeleton: FC = () => {
  const open = window.screen.width >= 1280;
  const drawerWidth = open ? "16rem" : "56px";

  return (
    <Box component="nav">
      <Drawer
        sx={{
          width: window.screen.width < 1280 ? "56px" : drawerWidth,
          transition: "width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
          whiteSpace: "nowrap",
        }}
        slotProps={{
          paper: {
            sx: {
              width: drawerWidth,
              transition: "width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
            },
          }
        }}
        variant="permanent"
        open={open}
      >
        <List>
          <ListItem >
            <ListItemButton>
              <ListItemIcon>
                {open ? (
                  <>
                    <ChevronLeftIcon />
                    <Typography sx={{ marginLeft: "1rem" }}>Toodl</Typography>
                  </>
                ) : (
                  <MenuIcon />
                )}
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <Divider />
        <List>
          {[1, 2, 3].map((i) => (
            <ListItem key={i}>
              <ListItemIcon>
                <Skeleton variant="circular" width={24} height={24} />
              </ListItemIcon>
              <ListItemText>
                <Skeleton height={24} width={100} />
              </ListItemText>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItemButton disabled>
            <ListItemIcon>
              <AddCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Maak een todolijst" />
          </ListItemButton>
        </List>
        <Divider />
        <List>
          <ListItemButton disabled>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Instellingen" />
          </ListItemButton>
          <ListItem >
            <ListItemButton disabled>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Afmelden" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default SidebarSkeleton;
