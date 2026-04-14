import { TextField, type TextFieldProps } from "@mui/material";

type FieldValue<T> = T extends { state: { value: infer U } } ? U : never;

type FormError = string | { message?: string } | null | undefined;

type Props<TField> = {
  field: TField;
} & Omit<
  TextFieldProps,
  "name" | "value" | "onBlur" | "onChange" | "error" | "helperText"
>;

export const ZodTextField = <
  TField extends {
    name: string;
    state: {
      value: unknown;
      meta: {
        errors: Array<FormError>;
      };
    };
    handleBlur: () => void;
    handleChange: (value: FieldValue<TField>) => void;
  }
>({
  field,
  ...props
}: Props<TField>) => {
  const errorMessages = field.state.meta.errors
    .map((e) => {
      if (!e) return null;
      if (typeof e === "string") return e;
      if (typeof e === "object" && "message" in e && typeof e.message === "string") {
        return e.message;
      }
      return null;
    })
    .filter(Boolean)
    .join(", ");

  return (
    <TextField
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={(e) =>
        field.handleChange(e.target.value as FieldValue<TField>)
      }
      error={field.state.meta.errors.length > 0}
      helperText={errorMessages || undefined}
      {...props}
    />
  );
};