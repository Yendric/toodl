import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { DefaultValues, FieldValues, UseFormProps, UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";

export type UseZodForm<TInput extends FieldValues> = UseFormReturn<TInput> & {
  id: string;
};
export function useZodForm<TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & {
    schema: TSchema;
  },
) {
  const form = useForm<TSchema["_input"]>({
    ...props,
    resolver: zodResolver(props.schema, undefined, { raw: true }),
    defaultValues: {
      ...(getDefaults<z.infer<typeof props.schema>>(props.schema) as DefaultValues<TSchema["_input"]>),
      ...props.defaultValues,
    },
  }) as UseZodForm<TSchema["_input"]>;

  form.id = useId();

  return form;
}

export type AnyZodForm = UseZodForm<any>;

export function getDefaults<Schema extends z.AnyZodObject>(schema: Schema) {
  return Object.fromEntries(
    Object.entries(schema.shape).map(([key, value]) => {
      if (value instanceof z.ZodDefault) return [key, value._def.defaultValue()];
      return [key, undefined];
    }),
  );
}
