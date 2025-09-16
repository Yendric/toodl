import AddCircleIcon from "@mui/icons-material/AddCircle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Skeleton, Typography } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { useState, type FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLists } from "../../api/list/getLists";
import { useAuth } from "../../context/AuthState";
import CreateListModal from "./CreateListModal";
import SidebarItem from "./SidebarItem";

const Sidebar: FC = () => {
  const { logout } = useAuth();

  const { data: lists, isSuccess } = useLists();
  const [modalVisible, setModalVisible] = useState(false);

  const [open, setOpen] = useState(window.screen.width >= 1280);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const location = useLocation();
  const isSettingsRoute = location.pathname === "/settings";

  const drawerWidth = open ? "16rem" : "56px";

  if (!isSuccess) {
    return (
      <Box component="nav">
        <Drawer
          sx={{
            width: window.screen.width < 1280 ? "56px" : drawerWidth,
            transition: "width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
            whiteSpace: "nowrap",
          }}
          PaperProps={{
            sx: {
              width: drawerWidth,
              transition: "width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
            },
          }}
          variant="permanent"
          open={open}
        >
          <List>
            <ListItem button onClick={handleDrawerToggle}>
              <ListItemIcon>{open ? <ChevronLeftIcon /> : <MenuIcon />}</ListItemIcon>
            </ListItem>
          </List>
          <Divider />
          <Divider />
          <List>
            <ListItem>
              <ListItemIcon>
                <Skeleton variant="circular" width={24} height={24} />
              </ListItemIcon>
              <ListItemText>
                <Skeleton height={24} width={100} />
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Skeleton variant="circular" width={24} height={24} />
              </ListItemIcon>
              <ListItemText>
                <Skeleton height={24} width={100} />
              </ListItemText>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button disabled>
              <ListItemIcon>
                <AddCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Maak een todolijst" />
            </ListItem>
          </List>
        </Drawer>
      </Box>
    );
  }

  return (
    <Box component="nav">
      <Drawer
        sx={{
          width: window.screen.width < 1280 ? "56px" : drawerWidth,
          transition: "width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
          whiteSpace: "nowrap",
        }}
        PaperProps={{
          sx: {
            width: drawerWidth,
            transition: "width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
          },
        }}
        variant="permanent"
        open={open}
      >
        <List>
          <ListItem button onClick={handleDrawerToggle}>
            <ListItemIcon>{open ? <><ChevronLeftIcon /><Typography sx={{ marginLeft: "1rem" }}>Toodl</Typography></> : <MenuIcon />}</ListItemIcon>
          </ListItem>
        </List>
        <Divider />
        <Divider />
        <List>
          {lists.map((list) => (
            <SidebarItem key={list.localId} list={list} />
          ))}
        </List>
        <Divider />
        <List>
          <ListItemButton onClick={() => setModalVisible(true)}>
            <ListItemIcon>
              <AddCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Maak een todolijst" />
          </ListItemButton>
        </List>
        <Divider />
        <List>

          <Link to="/settings">
            <ListItemButton selected={isSettingsRoute}  >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Instellingen" />
            </ListItemButton></Link>
          <ListItem button onClick={logout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Afmelden" />
          </ListItem>
        </List>
        <CreateListModal visible={modalVisible} onDismissed={() => setModalVisible(false)} />
      </Drawer>
    </Box>
  );
};

export default Sidebar;
