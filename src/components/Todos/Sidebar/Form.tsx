import { Button, FormLabel, Input, TextField } from "@mui/material";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import IList from "../../../types/IList";

interface Props {
  state?: IList;
  onSubmit: (list: IList) => void;
}

const Form: FC<Props> = ({ state, onSubmit }) => {
  const { control, handleSubmit } = useForm<IList>({ defaultValues: state });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormLabel>Naam</FormLabel>
      <Controller
        name="name"
        control={control}
        defaultValue=""
        rules={{
          required: "Gelieve een naam op te geven.",
          min: 1,
          max: 30,
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextField
            error={!!error}
            helperText={error ? error.message : null}
            variant="outlined"
            value={value}
            onChange={onChange}
            fullWidth
          />
        )}
      />

      <FormLabel>Kleur</FormLabel>
      <Controller
        name="color"
        control={control}
        defaultValue="#33AAFF"
        rules={{
          required: "Gelieve een kleur op te geven.",
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Input error={!!error} type="color" fullWidth value={value} onChange={onChange} />
        )}
      />

      <Button type="submit" variant="contained" sx={{ float: "right", marginTop: 1 }} color="primary">
        Opslaan
      </Button>
    </form>
  );
};

export default Form;
