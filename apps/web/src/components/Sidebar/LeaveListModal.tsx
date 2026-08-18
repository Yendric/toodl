import { Box, Button, Modal, Typography } from "@mui/material";
import { type FC } from "react";
import { type ListResponse } from "../../api/generated/model";
import { useShareLeave } from "../../api/generated/toodl";

interface Props {
  list: ListResponse;
  visible: boolean;
  onDismissed: () => void;
}

const LeaveListModal: FC<Props> = ({ list, visible, onDismissed }) => {
  const leaveShareMutation = useShareLeave();

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
          Lijst {list.name} verlaten?
        </Typography>
        <Typography sx={{ mb: 2 }}>
          Deze lijst is met je gedeeld door {list.ownerUsername}. Als je de lijst verlaat, verdwijnt die uit je zijbalk.
        </Typography>
        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            sx={{ mr: 1 }}
            color="error"
            onClick={() => {
              leaveShareMutation.mutate({ listId: list.id });
              onDismissed();
            }}
          >
            Ja, verlaat
          </Button>
          <Button variant="contained" onClick={onDismissed}>
            Annuleer
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default LeaveListModal;
