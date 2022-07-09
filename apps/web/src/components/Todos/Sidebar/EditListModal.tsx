import { joiResolver } from "@hookform/resolvers/joi";
import { Box, Button, FormControlLabel, FormLabel, Input, Modal, Switch, TextField, Typography } from "@mui/material";
import Joi from "joi";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { useList } from "../../../context/ListState";
import joiMessages from "../../../helpers/joiMessages";
import IList from "../../../types/IList";

interface Props {
  list: IList;
  visible: boolean;
  onDismissed: () => void;
}

const schema = Joi.object({
  name: Joi.string().max(20).required(),
})
  .messages(joiMessages)
  .unknown(true);

const EditListModal: FC<Props> = ({ visible, onDismissed, list }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IList>({ defaultValues: list, resolver: joiResolver(schema) });
  const lists = useList();

  const onSubmit = (list: IList) => {
    onDismissed();
    lists.update(list);
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
            label="Data uitschakelen"
          />

          <Box sx={{ textAlign: "center", mt: 1 }}>
            <Button type="submit" sx={{ mr: 1 }} variant="contained" color="primary">
              Opslaan
            </Button>
            <Button
              type="button"
              onClick={() => {
                lists.destroy(list);
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
  );
};

export default EditListModal;
