import { Input, type InputProps } from "@mui/material";

type FieldValue<T> = T extends { state: { value: infer U } } ? U : never;

type Props<TField> = {
  field: TField;
} & Omit<InputProps, "name" | "value" | "onBlur" | "onChange">;

export const ZodInput = <
  TField extends {
    name: string;
    state: { value: unknown };
    handleBlur: () => void;
    handleChange: (value: FieldValue<TField>) => void;
  }
>({
  field,
  ...props
}: Props<TField>) => {
  return (
    <Input
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={(e) =>
        field.handleChange(e.target.value as FieldValue<TField>)
      }
      {...props}
    />
  );
};