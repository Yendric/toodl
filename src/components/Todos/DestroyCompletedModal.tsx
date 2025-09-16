import { Box, Button, Modal, Typography } from "@mui/material";
import { type FC } from "react";
import { useCurrentList } from "../../context/CurrentListState";

interface Props {
  visible: boolean;
  onDismissed: () => void;
}

const DestroyCompletedModal: FC<Props> = ({ visible, onDismissed }) => {
  const { destroyCompleted } = useCurrentList();

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
          Weet u zeker dat u deze dat u de voltooide todos in deze lijst wil verwijderen?
        </Typography>
        <Typography sx={{ mb: 2 }}>Deze actie kan niet ongedaan worden gemaakt</Typography>
        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            sx={{ mr: 1 }}
            color="error"
            onClick={() => {
              destroyCompleted();
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

export default DestroyCompletedModal;
