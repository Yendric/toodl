import { FC, useState } from "react";
import Container from "@mui/material/Container";
import AddForm from "./AddForm";
import Todo from "./Todo";
import Button from "@mui/material/Button";
import { Divider, List, ListItem, ListItemIcon, Toolbar, Typography } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Sidebar from "./Sidebar/Sidebar";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import { useCurrentList } from "../../context/CurrentListState";

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

const Todos: FC = () => {
  const { todos, destroyCompleted } = useCurrentList();
  const [open, setOpen] = useState(window.screen.width >= 1280);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Box component="nav" sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}>
        <Drawer variant="permanent" open={open}>
          <Toolbar />
          <List>
            <ListItem button onClick={handleDrawerToggle}>
              <ListItemIcon>{open ? <ChevronLeftIcon /> : <MenuIcon />}</ListItemIcon>
            </ListItem>
          </List>
          <Divider />
          <Sidebar />
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, width: `calc(100% - 240px)` }}>
        <Box m={2}>
          {todos.some((todo) => todo.done) && (
            <Button sx={{ float: "left" }} onClick={() => destroyCompleted()} variant="contained">
              Verwijder voltooid
            </Button>
          )}
          <Typography sx={{ float: "right" }}>Onvoltooid: {todos.filter((todo) => !todo.done).length}</Typography>
        </Box>
        <AddForm />
        <Container maxWidth="md" sx={{ my: 2 }}>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="todos" sx={{ minWidth: 500 }}>
              {todos.length === 0 && (
                <caption>Zo te zien heb je nog geen todos in deze lijst, maak er één bovenaan!</caption>
              )}
              <TableBody>
                {todos
                  .filter((todo) => !todo.done)
                  .map((todo) => (
                    <Todo key={todo.id} todo={todo} />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          {todos.some((todo) => todo.done) && (
            <Typography variant="h6" mt={2}>
              Voltooide todos
            </Typography>
          )}
          <TableContainer component={Paper}>
            <Table size="small" aria-label="voltooide todos" sx={{ minWidth: 500 }}>
              <TableBody>
                {todos
                  .filter((todo) => todo.done)
                  .map((todo) => (
                    <Todo key={todo.id} todo={todo} />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>
    </Box>
  );
};

export default Todos;
