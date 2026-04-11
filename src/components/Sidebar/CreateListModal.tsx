import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { type FC } from "react";
import { useListStore } from "../../api/generated/toodl";
import { useZodForm } from "../../hooks/useZodForm";
import { storeSchema } from "../../schemas/list";

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
  } = useZodForm({ schema: storeSchema, defaultValues: { type: "REGULAR", color: "#33AAFF" } });

  const createListMutation = useListStore();

  const onSubmit = handleSubmit((list) => {
    onDismissed();
    reset();
    createListMutation.mutate({ data: list });
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
          <FormControl fullWidth sx={{ mt: 1 }}>
            <FormLabel>Naam</FormLabel>
            <TextField
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              variant="outlined"
              fullWidth
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <FormLabel>Kleur</FormLabel>
            <Input {...register("color")} type="color" fullWidth />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <FormLabel>Type</FormLabel>
            <Select {...register("type")} defaultValue="REGULAR" fullWidth>
              <MenuItem value="REGULAR">Normaal</MenuItem>
              <MenuItem value="SHOPPING">Winkel</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ textAlign: "center", mt: 2 }}>
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
