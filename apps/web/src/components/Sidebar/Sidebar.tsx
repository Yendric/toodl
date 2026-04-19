import AddCircleIcon from "@mui/icons-material/AddCircle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  Box,
  ClickAwayListener,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
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
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  const { data: lists } = useListIndexSuspense();
  const [modalVisible, setModalVisible] = useState(false);
  const [userControlledOpen, setUserControlledOpen] = useState<boolean | null>(null);

  const open = userControlledOpen ?? isLargeScreen;

  const handleDrawerToggle = () => {
    setUserControlledOpen(!open);
  };

  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (isLargeScreen) return;
    const clientX = "touches" in e ? e.touches[0]!.clientX : e.clientX;
    setTouchStart(clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (isLargeScreen || touchStart === null) return;
    const clientX = "changedTouches" in e ? e.changedTouches[0]!.clientX : e.clientX;
    const distance = clientX - touchStart;

    if (distance > 50 && !open) {
      setUserControlledOpen(true);
    } else if (distance < -50 && open) {
      setUserControlledOpen(false);
    }
    setTouchStart(null);
  };

  const handleClickAway = () => {
    if (!isLargeScreen && open) {
      setUserControlledOpen(false);
    }
  };

  const location = useLocation();
  const isSettingsRoute = location.pathname === "/settings";
  const isShoppingSettingsRoute = location.pathname === "/shopping-settings";

  const drawerWidth = open ? "16rem" : "56px";
  const containerWidth = isLargeScreen ? drawerWidth : "56px";

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box
        component="nav"
        sx={{
          width: containerWidth,
          flexShrink: 0,
          position: "relative",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Drawer
          slotProps={{
            paper: {
              onTouchStart: handleTouchStart,
              onTouchEnd: handleTouchEnd,
              sx: {
                touchAction: isLargeScreen ? "auto" : "none", // Prevent back gesture
              },
            },
          }}
          sx={{
            width: containerWidth,
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            whiteSpace: "nowrap",
            "& .MuiDrawer-paper": {
              viewTransitionName: "sidebar",
              width: drawerWidth,
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: "hidden",
              "& .MuiListItemText-root": {
                opacity: open ? 1 : 0,
              },
            },
          }}
          variant="permanent"
          open={open}
        >
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleDrawerToggle} sx={{ height: 48 }}>
              <ListItemIcon sx={{ minWidth: open ? 40 : 24 }}>{open ? <ChevronLeftIcon /> : <MenuIcon />}</ListItemIcon>
              {open && (
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Toodl
                </Typography>
              )}
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List sx={{ flexGrow: 1, overflowY: "auto", overflowX: "hidden" }}>
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
          <Link to="/shopping-settings" viewTransition style={{ textDecoration: "none", color: "inherit" }}>
            <ListItemButton selected={isShoppingSettingsRoute}>
              <ListItemIcon>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary="Winkelinstellingen" />
            </ListItemButton>
          </Link>
          <Link to="/settings" viewTransition style={{ textDecoration: "none", color: "inherit" }}>
            <ListItemButton selected={isSettingsRoute}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Instellingen" />
            </ListItemButton>
          </Link>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                void logout();
              }}
            >
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
    </ClickAwayListener>
  );
};

export default Sidebar;
