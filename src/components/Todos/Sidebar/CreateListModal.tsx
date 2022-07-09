import { joiResolver } from "@hookform/resolvers/joi";
import { Box, Button, FormControlLabel, FormLabel, Input, Modal, Switch, TextField, Typography } from "@mui/material";
import Joi from "joi";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { useCurrentList } from "../../../context/CurrentListState";
import { useList } from "../../../context/ListState";
import joiMessages from "../../../helpers/joiMessages";
import IList from "../../../types/IList";

interface Props {
  visible: boolean;
  onDismissed: () => void;
}

const schema = Joi.object({
  name: Joi.string().max(20).required(),
})
  .messages(joiMessages)
  .unknown(true);

const CreateListModal: FC<Props> = ({ visible, onDismissed }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IList>({ resolver: joiResolver(schema) });
  const lists = useList();
  const currentList = useCurrentList();

  const onSubmit = async (list: IList) => {
    onDismissed();
    const createdList = await lists.create(list);
    currentList.setList(createdList);
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
          <FormControlLabel control={<Switch {...register("withoutDates")} />} label="Data uitschakelen" />
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
