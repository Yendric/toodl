import AddCircleIcon from "@mui/icons-material/AddCircle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { useState, type FC } from "react";
import { Link, useLocation } from "react-router";
import type { ListResponse } from "../../api/generated/model";
import { useListIndexSuspense } from "../../api/generated/toodl";
import { useAuth } from "../../context/AuthState";
import CreateListModal from "./CreateListModal";
import SidebarItem from "./SidebarItem";

const Sidebar: FC = () => {
  const { logout } = useAuth();

  const { data: lists } = useListIndexSuspense();
  const [modalVisible, setModalVisible] = useState(false);

  const [open, setOpen] = useState(window.screen.width >= 1280);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const location = useLocation();
  const isSettingsRoute = location.pathname === "/settings";
  const isShoppingSettingsRoute = location.pathname === "/shopping-settings";

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
          <ListItem  >
            <ListItemButton onClick={handleDrawerToggle}>
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
          {lists.map((list: ListResponse) => (
            <SidebarItem key={list.id} list={list} />
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
          <Link to="/shopping-settings">
            <ListItemButton selected={isShoppingSettingsRoute}>
              <ListItemIcon>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary="Winkelinstellingen" />
            </ListItemButton>
          </Link>
          <Link to="/settings">
            <ListItemButton selected={isSettingsRoute}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Instellingen" />
            </ListItemButton>
          </Link>
          <ListItem disablePadding>
            <ListItemButton onClick={logout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Afmelden" />
            </ListItemButton>
          </ListItem>
        </List>
        <CreateListModal visible={modalVisible} onDismissed={() => setModalVisible(false)} />
      </Drawer>
    </Box>
  );
};

export default Sidebar;
