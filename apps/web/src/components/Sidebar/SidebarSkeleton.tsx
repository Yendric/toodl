import AddCircleIcon from "@mui/icons-material/AddCircle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { type FC } from "react";

const SidebarSkeleton: FC = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const open = isLargeScreen;
  const drawerWidth = open ? "16rem" : "56px";
  const containerWidth = isLargeScreen ? drawerWidth : "56px";

  return (
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
            sx: {
              touchAction: isLargeScreen ? "auto" : "none",
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
            <ListItemButton disabled sx={{ height: 48 }}>
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
          {[1, 2, 3, 4, 5].map((i) => (
            <ListItem key={i} sx={{ px: 2, py: 1 }}>
              <ListItemIcon sx={{ minWidth: open ? 40 : 24 }}>
                <Skeleton variant="circular" width={24} height={24} />
              </ListItemIcon>
              {open && (
                <ListItemText>
                  <Skeleton height={24} width="80%" />
                </ListItemText>
              )}
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
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="Winkelinstellingen" />
          </ListItemButton>
          <ListItemButton disabled>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Instellingen" />
          </ListItemButton>
          <ListItem disablePadding>
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
