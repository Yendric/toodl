import { Checkbox, type CheckboxProps } from "@mui/material";

type FieldValue<T> = T extends { state: { value: infer U } } ? U : never;

type Props<TField> = {
  field: TField;
} & Omit<CheckboxProps, "checked" | "onChange" | "name" | "value" | "onBlur">;

export const ZodCheckbox = <
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
    <Checkbox
      name={field.name}
      checked={field.state.value as boolean | undefined}
      onBlur={field.handleBlur}
      onChange={(e) => field.handleChange(e.target.checked as FieldValue<TField>)}
      {...props}
    />
  );
};
