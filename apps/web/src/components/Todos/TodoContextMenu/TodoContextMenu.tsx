import { Menu, MenuItem } from "@mui/material";
import { useState, type FC } from "react";
import { type LocalTodo } from "../../../types/Todo";
import DeadlineModal from "./DeadlineModal";
import DestroyModal from "./DestroyModal";
import EditModal from "./EditModal";

interface Props {
  todo: LocalTodo;
  contextMenu: { mouseX: number; mouseY: number } | null;
  handleClose: () => void;
}

const TodoContextMenu: FC<Props> = ({ todo, contextMenu, handleClose }) => {
  const [openModal, setOpenModal] = useState<"edit" | "delete" | "deadline" | null>(null);

  return (
    <>
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
      >
        <MenuItem
          onClick={() => {
            setOpenModal("edit");
            handleClose();
          }}
        >
          Todo bewerken
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenModal("deadline");
            handleClose();
          }}
        >
          Deadline instellen
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenModal("delete");
            handleClose();
          }}
        >
          Verwijderen
        </MenuItem>
      </Menu>
      <EditModal todo={todo} visible={openModal === "edit"} onDismissed={() => setOpenModal(null)} />
      <DeadlineModal todo={todo} visible={openModal === "deadline"} onDismissed={() => setOpenModal(null)} />
      <DestroyModal todo={todo} visible={openModal === "delete"} onDismissed={() => setOpenModal(null)} />
    </>
  );
};

export default TodoContextMenu;
