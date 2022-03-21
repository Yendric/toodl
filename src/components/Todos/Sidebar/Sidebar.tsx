import { Box, Divider, List, ListItem, ListItemIcon, ListItemText, Modal, Typography } from "@mui/material";
import { FC, useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Row from "./Row";
import { useList } from "../../../context/ListState";
import IList from "../../../types/IList";
import Form from "./Form";

const Sidebar: FC = () => {
  const { lists } = useList();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { create } = useList();

  const onSubmit = (list: IList) => {
    handleClose();
    create(list);
  };

  return (
    <>
      <Divider />
      <List>
        {lists.map((list) => (
          <Row key={list.id} list={list} />
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleOpen}>
          <ListItemIcon>
            <AddCircleIcon />
          </ListItemIcon>
          <ListItemText primary="Maak een todolijst" />
        </ListItem>
      </List>
      <Modal
        open={open}
        onClose={handleClose}
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
            Lijst aanmaken
          </Typography>

          <Form onSubmit={onSubmit} />
        </Box>
      </Modal>
    </>
  );
};

export default Sidebar;
