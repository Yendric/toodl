import { FC } from "react";
import Container from "@mui/material/Container";
import CreateTodoForm from "./CreateTodoForm";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Sidebar from "./Sidebar/Sidebar";
import { useCurrentList } from "../../context/CurrentListState";
import TodoRow from "./TodoRow";

const TodoContainer: FC = () => {
  const currentList = useCurrentList();

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box component="main" sx={{ p: 2, width: "calc(100% - 56px)" }}>
        <Box sx={{ mb: 2 }}>
          <Button
            sx={{ float: "left" }}
            disabled={!currentList.todos.some((todo) => todo.done)}
            onClick={() => currentList.destroyCompleted()}
            variant="contained"
          >
            Verwijder voltooid
          </Button>
          <Typography sx={{ float: "right" }}>
            Onvoltooid: {currentList.todos.filter((todo) => !todo.done).length}
          </Typography>
        </Box>
        <CreateTodoForm />
        <Container sx={{ p: 0 }} maxWidth="md">
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table size="small" aria-label="todos">
              {currentList.todos.length === 0 && (
                <caption>Zo te zien heb je nog geen todos in deze lijst, maak er één bovenaan!</caption>
              )}
              <TableBody>
                {currentList.todos
                  .filter((todo) => !todo.done)
                  .map((todo) => (
                    <TodoRow key={todo.id} todo={todo} />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          {currentList.todos.some((todo) => todo.done) && <Typography variant="h6">Voltooide todos</Typography>}
          <TableContainer component={Paper}>
            <Table size="small" aria-label="voltooide todos">
              <TableBody>
                {currentList.todos
                  .filter((todo) => todo.done)
                  .map((todo) => (
                    <TodoRow key={todo.id} todo={todo} />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>
    </Box>
  );
};

export default TodoContainer;
