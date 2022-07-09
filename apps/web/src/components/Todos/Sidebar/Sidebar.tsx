import { Box, Divider, List, ListItem, ListItemIcon, ListItemText, Toolbar } from "@mui/material";

import { styled, Theme, CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import { FC, useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SidebarItem from "./SidebarItem";
import { useList } from "../../../context/ListState";
import CreateListModal from "./CreateListModal";

const Sidebar: FC = () => {
  const { lists } = useList();
  const [modalVisible, setModalVisible] = useState(false);

  const [open, setOpen] = useState(window.screen.width >= 1280);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const drawerWidth = 240;

  const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
  });

  const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)})`,
  });

  const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  }));

  return (
    <Box component="nav">
      <Drawer variant="permanent" open={open}>
        <Toolbar />
        <List>
          <ListItem button onClick={handleDrawerToggle}>
            <ListItemIcon>{open ? <ChevronLeftIcon /> : <MenuIcon />}</ListItemIcon>
          </ListItem>
        </List>
        <Divider />
        <Divider />
        <List>
          {lists.map((list) => (
            <SidebarItem key={list.id} list={list} />
          ))}
        </List>
        <Divider />
        <List>
          <ListItem button onClick={() => setModalVisible(true)}>
            <ListItemIcon>
              <AddCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Maak een todolijst" />
          </ListItem>
        </List>
        <CreateListModal visible={modalVisible} onDismissed={() => setModalVisible(false)} />
      </Drawer>
    </Box>
  );
};

export default Sidebar;
