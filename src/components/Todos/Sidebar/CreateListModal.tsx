import { Box, Button, FormLabel, Input, Modal, TextField, Typography } from "@mui/material";
import { FC } from "react";
import { useStoreList } from "../../../api/list/storeList";
import { useZodForm } from "../../../hooks/useZodForm";
import { storeSchema } from "../../../schemas/list";

interface Props {
  visible: boolean;
  onDismissed: () => void;
}

const CreateListModal: FC<Props> = ({ visible, onDismissed }) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useZodForm({ schema: storeSchema });

  const createListMutation = useStoreList();

  const onSubmit = handleSubmit((list) => {
    onDismissed();
    reset();
    createListMutation.mutate(list);
  });

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
          Lijst aanmaken
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
          <Input defaultValue="#33AAFF" {...register("color")} type="color" fullWidth />
          <Box sx={{ textAlign: "center", mt: 1 }}>
            <Button type="submit" variant="contained" color="primary">
              Maken
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateListModal;
