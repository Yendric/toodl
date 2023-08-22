import AddCircleIcon from "@mui/icons-material/AddCircle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Divider, List, ListItem, ListItemIcon, ListItemText, Skeleton, Toolbar } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { FC, useState } from "react";
import { useLists } from "../../../api/list/getLists";
import CreateListModal from "./CreateListModal";
import SidebarItem from "./SidebarItem";

const Sidebar: FC = () => {
  const { data: lists, isSuccess } = useLists();
  const [modalVisible, setModalVisible] = useState(false);

  const [open, setOpen] = useState(window.screen.width >= 1280);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  if (!isSuccess) {
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
            // We gebruiken deze speciale key en niet 'id', omdat we optimistische updates doen en hiervoor tijdelijk een ander id gebruiken
            <SidebarItem key={list.color + list.name + list.withoutDates} list={list} />
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
