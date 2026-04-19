import { Box } from "@mui/material";
import { type FC } from "react";
import SidebarSkeleton from "../../components/Sidebar/SidebarSkeleton";
import TodoTableSkeleton from "../../components/Todos/TodoTableSkeleton";

const TodosLoading: FC = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <SidebarSkeleton />
      <TodoTableSkeleton />
    </Box>
  );
};

export default TodosLoading;
