"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  ResetPasswordData,
  resetPasswordSchema,
} from "@/app/reset-password/schema";
import { api, ApiError } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onTouched",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async ({ password }: ResetPasswordData) => {
    setLoading(true);
    try {
      await api("/users/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });

      form.reset();
      toast.success("Senha redefinida com sucesso!");
      router.push("/signin");
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        toast.error("Token inválido ou expirado. Solicite um novo link.");
        router.push("/forgot-password");
        return;
      }

      toast.error(
        error instanceof ApiError
          ? error.message
          : "Não foi possível conectar ao servidor. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <FormField
          control={form.control}
          name="password"
          rules={{ deps: ["confirmPassword"] }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nova senha</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar nova senha</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {loading ? "Redefinindo..." : "Redefinir senha"}
        </Button>
      </form>
    </Form>
  );
}
