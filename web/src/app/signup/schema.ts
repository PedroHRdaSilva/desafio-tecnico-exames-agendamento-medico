import { z } from "zod";

export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Informe seu nome")
      .min(3, "O nome deve ter pelo menos 3 caracteres"),

    email: z
      .string()
      .min(1, "Informe seu e-mail")
      .email("Informe um e-mail válido"),

    password: z
      .string()
      .min(1, "Informe sua senha")
      .min(8, "A senha deve ter pelo menos 8 caracteres"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type SignupData = z.infer<typeof signupSchema>;
