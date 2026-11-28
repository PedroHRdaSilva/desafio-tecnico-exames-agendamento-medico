"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

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
import { api, ApiError } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      await api("/users/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: email.trim() }),
      });
      toast.success(
        "Se houver uma conta com esse e-mail, você receberá um link para redefinir sua senha.",
      );
      router.push("/signin");
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Erro ao enviar e-mail",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-amber-200 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl p-2">Esqueceu sua senha?</CardTitle>
          <CardDescription>
            Informe seu e-mail e enviaremos um link para você redefinir sua
            senha
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Enviando..." : "Enviar link"}
            </Button>
          </form>
        </CardContent>

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
