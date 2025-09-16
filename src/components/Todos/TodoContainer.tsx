import Box from "@mui/material/Box";
import { type FC } from "react";
import Sidebar from "../Sidebar/Sidebar";
import TodoTable from "./TodoTable";
import WelcomeUserModal from "./WelcomeUserModal";

const TodoContainer: FC = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <WelcomeUserModal />
      <Sidebar />
      <TodoTable />
    </Box>
  );
};

export default TodoContainer;
