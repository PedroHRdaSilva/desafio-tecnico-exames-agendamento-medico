import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Informe seu e-mail")
    .email("Informe um e-mail válido"),
});

export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
