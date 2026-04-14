import { useForm, type FormAsyncValidateOrFn, type FormOptions, type FormValidateOrFn } from "@tanstack/react-form";
import { z } from "zod";

// Typescript moment

export function useZodForm<
  TSchema extends z.ZodTypeAny,
  TOnMount extends FormValidateOrFn<z.input<TSchema>> | undefined = undefined,
  TOnChangeAsync extends FormAsyncValidateOrFn<z.input<TSchema>> | undefined = undefined,
  TOnBlur extends FormValidateOrFn<z.input<TSchema>> | undefined = undefined,
  TOnBlurAsync extends FormAsyncValidateOrFn<z.input<TSchema>> | undefined = undefined,
  TOnSubmit extends FormValidateOrFn<z.input<TSchema>> | undefined = undefined,
  TOnSubmitAsync extends FormAsyncValidateOrFn<z.input<TSchema>> | undefined = undefined,
  TOnDynamic extends FormValidateOrFn<z.input<TSchema>> | undefined = undefined,
  TOnDynamicAsync extends FormAsyncValidateOrFn<z.input<TSchema>> | undefined = undefined,
  TOnServer extends FormAsyncValidateOrFn<z.input<TSchema>> | undefined = undefined,
  TSubmitMeta = unknown,
>(
  schema: TSchema,
  options: Omit<
    FormOptions<
      z.input<TSchema>,
      TOnMount,
      TSchema,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnDynamic,
      TOnDynamicAsync,
      TOnServer,
      TSubmitMeta
    >,
    "validators"
  >,
) {
  return useForm<
    z.input<TSchema>,
    TOnMount,
    TSchema,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnDynamic,
    TOnDynamicAsync,
    TOnServer,
    TSubmitMeta
  >({
    ...options,
    validators: {
      onSubmit: schema as unknown as TOnSubmit,
    },
  });
}