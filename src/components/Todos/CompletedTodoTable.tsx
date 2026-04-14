import { Paper, Table, TableBody, TableContainer, Typography } from "@mui/material";
import { type FC } from "react";
import type { TodoResponse } from "../../api/generated/model";
import TodoRow from "./TodoRow";

interface Props {
  completedTodos: TodoResponse[];
}

const CompletedTodoTable: FC<Props> = ({ completedTodos }) => {
  if (completedTodos.length === 0) return null;

  return (
    <>
      <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
        Voltooide todos
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="voltooide todos">
          <TableBody>
            {completedTodos.map((todo) => (
              <TodoRow key={todo.id} todo={todo} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CompletedTodoTable;
