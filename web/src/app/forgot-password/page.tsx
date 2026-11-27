"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordSchema } from "@/app/forgot-password/schema";

function validateEmail(email: string) {
  const result = forgotPasswordSchema.safeParse({ email });
  return result.success ? undefined : result.error.issues[0]?.message;
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent] = useState(false);

  function handleChange(value: string) {
    setEmail(value);
    if (submitted) setError(validateEmail(value));
  }

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    const message = validateEmail(email);
    setError(message);
    if (message) return;

    console.log({ email: email.trim() });
    setSent(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-amber-200 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Esqueceu sua senha?</CardTitle>
          <CardDescription>
            {sent
              ? "Se houver uma conta com esse e-mail, você receberá um link para redefinir sua senha."
              : "Informe seu e-mail e enviaremos um link para você redefinir sua senha"}
          </CardDescription>
        </CardHeader>

        {!sent && (
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
              noValidate
            >
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => handleChange(e.target.value)}
                  aria-invalid={!!error}
                  aria-describedby="email-error"
                />
                <p id="email-error" className="min-h-5 text-sm text-red-500">
                  {error}
                </p>
              </div>

              <Button type="submit" className="w-full">
                Enviar link
              </Button>
            </form>
          </CardContent>
        )}

        <CardFooter className="justify-center">
          <Link
            href="/signin"
            className="text-sm font-medium underline-offset-4 hover:underline"
          >
            Voltar para o login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
