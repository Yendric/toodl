import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, FormControlLabel, FormLabel, Input, Modal, Switch, TextField, Typography } from "@mui/material";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDestroyList } from "../../../api/list/destroyList";
import { useUpdateList } from "../../../api/list/updateList";
import IList from "../../../types/IList";

interface Props {
  list: IList;
  visible: boolean;
  onDismissed: () => void;
}

const schema = z.object({
  name: z.string().min(1).max(20),
  color: z.string().length(7),
  withoutDates: z.boolean(),
});

const EditListModal: FC<Props> = ({ visible, onDismissed, list }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({ defaultValues: list, resolver: zodResolver(schema) });

  const updateListMutation = useUpdateList();
  const deleteListMutation = useDestroyList();

  const onSubmit = (data: z.infer<typeof schema>) => {
    onDismissed();
    updateListMutation.mutate({ ...list, ...data });
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
          Lijst {list.name} bewerken
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
          <Input defaultValue={list.color} {...register("color")} type="color" fullWidth />
          <FormControlLabel
            control={<Switch defaultChecked={list.withoutDates} {...register("withoutDates")} />}
            label="Deadlines uitschakelen"
          />

          <Box sx={{ textAlign: "center", mt: 1 }}>
            <Button type="submit" sx={{ mr: 1 }} variant="contained" color="primary">
              Opslaan
            </Button>
            <Button
              type="button"
              onClick={() => {
                onDismissed();
                deleteListMutation.mutate(list);
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
  );
};

export default EditListModal;
