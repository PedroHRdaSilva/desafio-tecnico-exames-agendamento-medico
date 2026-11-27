import { z } from "zod";

export const signinSchema = z.object({
  email: z
    .string()
    .min(1, "Informe seu e-mail")
    .email("Informe um e-mail válido"),

  password: z.string().min(1, "Informe sua senha"),
});

export type SigninData = z.infer<typeof signinSchema>;
