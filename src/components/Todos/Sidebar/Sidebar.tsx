import { Box, Divider, List, ListItem, ListItemIcon, ListItemText, Toolbar } from "@mui/material";
import Drawer from "@mui/material/Drawer";
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

  return (
    <Box component="nav">
      <Drawer
        sx={{
          width: window.screen.width <= 1280 ? "56px" : open ? "16rem" : "56px",
          transition: "width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
          whiteSpace: "nowrap",
        }}
        PaperProps={{
          sx: {
            width: open ? "16rem" : "56px",
            transition: "width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
          },
        }}
        variant="permanent"
        open={open}
      >
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
