import { Box, Button, Modal, Typography } from "@mui/material";
import { type FC } from "react";
import { useDestroyTodo } from "../../../api/todo/destroyTodo";
import { type LocalTodo } from "../../../types/Todo";

interface Props {
  todo: LocalTodo;
  visible: boolean;
  onDismissed: () => void;
}

const DestroyModal: FC<Props> = ({ todo, visible, onDismissed }) => {
  const destroyTodoMutation = useDestroyTodo();

  return (
    <Modal
      open={visible}
      onClose={onDismissed}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          Weet u zeker dat u deze todo wil verwijderen?
        </Typography>
        <Typography sx={{ mb: 2 }}>Deze actie kan niet ongedaan worden gemaakt</Typography>
        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            sx={{ mr: 1 }}
            color="error"
            onClick={() => {
              destroyTodoMutation.mutate(todo);
              onDismissed();
            }}
          >
            Ja, verwijder
          </Button>
          <Button variant="contained" onClick={onDismissed}>
            Annuleer
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DestroyModal;
