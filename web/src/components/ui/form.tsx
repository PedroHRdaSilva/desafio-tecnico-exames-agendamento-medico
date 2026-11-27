"use client";

import * as React from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  useWatch,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { cn } from "@/lib/utils/utils";
import { Label } from "@/components/ui/label";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue | null>(
  null,
);

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue | null>(null);

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, control } = useFormContext();

  if (!fieldContext) {
    throw new Error("useFormField deve ser usado dentro de <FormField>");
  }
  if (!itemContext) {
    throw new Error("useFormField deve ser usado dentro de <FormItem>");
  }

  const formState = useFormState({ name: fieldContext.name });
  const { isSubmitted } = useFormState({ control });
  const value = useWatch({ control, name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);
  const { id } = itemContext;

  // Antes da primeira tentativa de envio, o erro (label, borda e mensagem)
  // só aparece se o usuário já passou pelo campo e ele não está vazio.
  // Isso evita, por exemplo, o "Confirmar senha" acusar erro quando só a
  // senha foi digitada (ela revalida a confirmação via `deps`).
  const hideError =
    !isSubmitted && (!fieldState.isTouched || isEmptyValue(value));

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
    invalid: hideError ? false : fieldState.invalid,
    error: hideError ? undefined : fieldState.error,
  };
}

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  const { error, formItemId } = useFormField();

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn("data-[error=true]:text-red-500", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
}

/**
 * Equivalente ao FormControl do shadcn, sem depender do @radix-ui/react-slot:
 * injeta id e atributos de acessibilidade no único elemento filho.
 */
function FormControl({ children }: { children: React.ReactElement }) {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return React.cloneElement(
    children as React.ReactElement<Record<string, unknown>>,
    {
      "data-slot": "form-control",
      id: formItemId,
      "aria-describedby": error
        ? `${formDescriptionId} ${formMessageId}`
        : formDescriptionId,
      "aria-invalid": !!error,
    },
  );
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function isEmptyValue(value: unknown) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "")
  );
}

/**
 * Sempre renderizado com altura mínima de uma linha, para o layout
 * não "pular" quando a mensagem de erro aparece.
 */
function FormMessage({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error.message ?? "") : children;

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("min-h-5 text-sm text-red-500", className)}
      {...props}
    >
      {body}
    </p>
  );
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
