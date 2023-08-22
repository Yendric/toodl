import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, FormControlLabel, FormLabel, Input, Modal, Switch, TextField, Typography } from "@mui/material";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateList } from "../../../api/list/createList";
import IList from "../../../types/IList";

interface Props {
  visible: boolean;
  onDismissed: () => void;
}

const schema = z.object({
  name: z.string().min(1).max(20),
  color: z.string().length(7),
  withoutDates: z.boolean(),
});

const CreateListModal: FC<Props> = ({ visible, onDismissed }) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<IList>({ resolver: zodResolver(schema) });
  const createListMutation = useCreateList();

  const onSubmit = async (list: IList) => {
    onDismissed();
    reset();
    createListMutation.mutate(list);
  };

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

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
          <FormControlLabel
            control={<Switch {...register("withoutDates")} defaultChecked={true} />}
            label="Deadlines uitschakelen"
          />
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
