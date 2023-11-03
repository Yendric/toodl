import { Box, Button, FormLabel, Input, Modal, TextField, Typography } from "@mui/material";
import { FC, useState } from "react";
import { useUpdateList } from "../../../api/list/updateList";
import { useZodForm } from "../../../hooks/useZodForm";
import { updateSchema } from "../../../schemas/list";
import { LocalList } from "../../../types/List";
import DestroyListModal from "./DestroyListModal";

interface Props {
  list: LocalList;
  visible: boolean;
  onDismissed: () => void;
}

const EditListModal: FC<Props> = ({ visible, onDismissed, list }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useZodForm({ schema: updateSchema, defaultValues: list });

  const [destroyModalOpen, setDestroyModalOpen] = useState(false);

  const updateListMutation = useUpdateList();

  const onSubmit = handleSubmit((data) => {
    onDismissed();
    updateListMutation.mutate({ ...list, ...data });
  });

  return (
    <>
      <DestroyListModal list={list} visible={destroyModalOpen} onDismissed={() => setDestroyModalOpen(false)} />
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
            Lijst {list.name} bewerken
          </Typography>

          <form onSubmit={onSubmit} noValidate>
            <FormLabel>Naam</FormLabel>
            <TextField
              inputProps={register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              variant="outlined"
              fullWidth
            />
            <FormLabel>Kleur</FormLabel>
            <Input defaultValue={list.color} {...register("color")} type="color" fullWidth />
            <Box sx={{ textAlign: "center", mt: 1 }}>
              <Button type="submit" sx={{ mr: 1 }} variant="contained" color="primary">
                Opslaan
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setDestroyModalOpen(true);
                  onDismissed();
                }}
                variant="contained"
                color="error"
              >
                Verwijderen
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default EditListModal;
