import { Box, Button, Modal, Typography } from "@mui/material";
import { type FC } from "react";
import { useDestroyList } from "../../api/list/destroyList";
import { type LocalList } from "../../types/List";

interface Props {
  list: LocalList;
  visible: boolean;
  onDismissed: () => void;
}

const DestroyListModal: FC<Props> = ({ list, visible, onDismissed }) => {
  const destroyListMutation = useDestroyList();

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
          Weet u zeker dat u deze lijst wil verwijderen?
        </Typography>
        <Typography sx={{ mb: 2 }}>Deze actie kan niet ongedaan worden gemaakt</Typography>
        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            sx={{ mr: 1 }}
            color="error"
            onClick={() => {
              destroyListMutation.mutate(list);
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

export default DestroyListModal;
