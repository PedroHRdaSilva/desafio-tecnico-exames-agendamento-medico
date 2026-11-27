"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SigninData, signinSchema } from "@/app/signin/schema";

export default function SigninPage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
  } = useForm<SigninData>({
    resolver: zodResolver(signinSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });

  const values = useWatch({ control });

  // Erro de campo vazio só aparece depois da primeira tentativa de envio.
  function visibleError(field: keyof SigninData) {
    if (!isSubmitted && !values[field]?.trim()) return undefined;
    return errors[field]?.message;
  }

  function onSubmit(data: SigninData) {
    console.log(data);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-amber-200">
      <Card className="w-full max-w-sm h-auto">
        <CardHeader>
          <CardTitle>Bem-vindo</CardTitle>
          <CardDescription>
            Insira seu e-mail abaixo para acessar sua conta
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  {...register("email")}
                />
                <p className="min-h-5 text-sm text-red-500">
                  {visibleError("email")}
                </p>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <a
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Esqueceu sua senha?
                  </a>
                </div>

                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />

                <p className="min-h-5 text-sm text-red-500">
                  {visibleError("password")}
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full">
              Entrar
            </Button>

            <Button type="button" variant="outline" className="w-full">
              Login com Google
            </Button>

            <p className="mt-2 text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Link
                href="/signup"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Cadastre-se
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
