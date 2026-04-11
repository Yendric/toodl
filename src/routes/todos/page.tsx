import { Box } from "@mui/material";
import { Suspense, type FC } from "react";
import { useSearchParams } from "react-router";
import PrivateRoute from "../../components/PrivateRoute";
import Sidebar from "../../components/Sidebar/Sidebar";
import TodoTable from "../../components/Todos/TodoTable";
import TodoTableSkeleton from "../../components/Todos/TodoTableSkeleton";
import WelcomeUserModal from "../../components/Todos/WelcomeUserModal";
import { CurrentListProvider } from "../../context/CurrentListState";

const Todos: FC = () => {
  const [searchParams] = useSearchParams();
  const currentListId = Number(searchParams.get("list")) || 0;

  return (
    <PrivateRoute>
      <CurrentListProvider>
        <Box sx={{ display: "flex" }}>
          <WelcomeUserModal />
          <Sidebar />
          <Suspense key={currentListId} fallback={<TodoTableSkeleton />}>
            <TodoTable />
          </Suspense>
        </Box>
      </CurrentListProvider>
    </PrivateRoute>
  );
};

export default Todos;
