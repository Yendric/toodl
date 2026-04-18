import { Select, type SelectChangeEvent, type SelectProps } from "@mui/material";

type FieldValue<T> = T extends { state: { value: infer U } } ? U : never;

type Props<TField> = {
  field: TField;
} & Omit<SelectProps<FieldValue<TField>>, "name" | "value" | "onBlur" | "onChange">;

export const ZodSelect = <
  TField extends {
    name: string;
    state: { value: unknown };
    handleBlur: () => void;
    handleChange: (value: FieldValue<TField>) => void;
  },
>({
  field,
  ...props
}: Props<TField>) => {
  return (
    <Select
      name={field.name}
      value={field.state.value as FieldValue<TField>}
      onBlur={field.handleBlur}
      onChange={(e: SelectChangeEvent<FieldValue<TField>>) => field.handleChange(e.target.value as FieldValue<TField>)}
      {...props}
    />
  );
};
