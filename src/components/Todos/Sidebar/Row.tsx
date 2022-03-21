import { Box, Button, ListItem, ListItemIcon, ListItemText, Modal, Typography } from "@mui/material";
import { FC, useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import IList from "../../../types/IList";
import { useCurrentList } from "../../../context/CurrentListState";
import { useList } from "../../../context/ListState";
import Form from "./Form";

type Props = {
  list: IList;
};

const Row: FC<Props> = ({ list }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { update, destroy } = useList();
  const { currentList, setCurrentList } = useCurrentList();

  const onSubmit = (list: IList) => {
    handleClose();
    update(list);
  };
  const onDestroy = () => {
    handleClose();
    destroy(list);
  };

  return (
    <>
      <ListItem
        selected={currentList?.id === list.id}
        button
        key={list.id}
        onClick={() => setCurrentList(list)}
        onDoubleClick={handleOpen}
      >
        <ListItemIcon>
          <CircleIcon sx={{ color: list.color }} />
        </ListItemIcon>
        <ListItemText primary={list.name} />
      </ListItem>
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
            Lijst {list.name} bewerken
          </Typography>

          <Form state={list} onSubmit={onSubmit} />

          <Button onClick={onDestroy} variant="contained" sx={{ float: "left", marginTop: 1 }} color="error">
            Verwijder
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default Row;
