import { Box, Button, Modal, Typography } from "@mui/material";
import { FC, useState } from "react";

const WelcomeUserModal: FC = () => {
  const [modalVisible, setModalVisible] = useState(window.location.href.includes("?newUser"));

  return (
    <Modal
      open={modalVisible}
      onClose={() => setModalVisible(false)}
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
        <Typography variant="h4" component="h2">
          Welkom bij Toodl
        </Typography>
        <Typography sx={{ mb: 2 }}>
          Je kan nu beginnen met het plannen van je leven! (Of eindeloze lijstjes te maken zonder er ooit iets mee te
          doen ;)).
        </Typography>
        <Typography sx={{ mb: 2 }}>
          Links zie je een zijbalk met al je lijstjes. Je kan ze kleurtjes en een naam geven, en je kan kiezen of de
          todos in die lijst een deadline moeten hebben of niet (data).
        </Typography>
        <Typography sx={{ mb: 2 }}>
          In het planningstabblad vind je een overzicht van al je todos, in kalenderformaat. Je kan ook andere deadlines
          integreren door je agenda-ical link in te voeren bij instellingen (rechtsboven).
        </Typography>
        <Typography sx={{ mb: 2 }}>
          Tenslotte is het handig om te weten dat de app ook offline werkt en alle wijzigingen worden gesynchroniseerd
          zodra u weer online bent.
        </Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Veel plezier!
        </Typography>
        <Box sx={{ textAlign: "center" }}>
          <Button variant="contained" onClick={() => setModalVisible(false)}>
            Begrepen!
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default WelcomeUserModal;
