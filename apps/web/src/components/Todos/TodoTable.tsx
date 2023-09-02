import { Box, Skeleton, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import { FC } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useCurrentList } from "../../context/CurrentListState";
import CreateTodoForm from "./CreateTodoForm";
import TodoRow from "./TodoRow";

const TodoTable: FC = () => {
  const { list, destroyCompleted, listTodos } = useCurrentList();

  if (list == undefined) {
    return (
      <Box component="main" sx={{ p: 2, width: "calc(100% - 56px)" }}>
        <Box sx={{ mb: 2 }}>
          <Button sx={{ float: "left" }} disabled={true} variant="contained">
            Verwijder voltooid
          </Button>
          <Typography sx={{ float: "right" }}>
            <Skeleton width={100} />
          </Typography>
        </Box>
        <CreateTodoForm disabled={true} />
        <Container sx={{ p: 0 }} maxWidth="md">
          <Skeleton height={40} />
          <Skeleton height={40} />
          <Skeleton height={40} />
        </Container>
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ p: 2, width: "calc(100% - 56px)" }}>
      <Box sx={{ mb: 2 }}>
        <Button
          sx={{ float: "left" }}
          disabled={!listTodos.some((todo) => todo.done)}
          onClick={destroyCompleted}
          variant="contained"
        >
          Verwijder voltooid
        </Button>
        <Typography sx={{ float: "right" }}>Onvoltooid: {listTodos.filter((todo) => !todo.done).length}</Typography>
      </Box>
      <CreateTodoForm />
      <Container sx={{ p: 0 }} maxWidth="md">
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table size="small" aria-label="todos">
            {listTodos.length === 0 && (
              <caption>Zo te zien heb je nog geen todos in deze lijst, maak er één bovenaan!</caption>
            )}
            <TableBody>
              <TransitionGroup appear={false} component={null} className="todo-list">
                {listTodos
                  .filter((todo) => !todo.done)
                  .map((todo) => (
                    <CSSTransition key={todo.localId} timeout={200} classNames="todo">
                      <TodoRow todo={todo} />
                    </CSSTransition>
                  ))}
              </TransitionGroup>
            </TableBody>
          </Table>
        </TableContainer>
        {listTodos.some((todo) => todo.done) && <Typography variant="h6">Voltooide todos</Typography>}
        <TableContainer component={Paper}>
          <Table size="small" aria-label="voltooide todos">
            <TableBody>
              <TransitionGroup appear={false} component={null} className="todo-list">
                {listTodos
                  .filter((todo) => todo.done)
                  .map((todo) => (
                    <CSSTransition key={todo.localId} timeout={200} classNames="todo">
                      <TodoRow todo={todo} />
                    </CSSTransition>
                  ))}
              </TransitionGroup>
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default TodoTable;
