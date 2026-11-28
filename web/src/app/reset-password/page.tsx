import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResetPasswordForm } from "@/app/reset-password/reset-password-form";

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string }>;
};

async function ResetPasswordContent({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams;

  if (!token) redirect("/forgot-password");

  return <ResetPasswordForm token={token} />;
}

export default function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-amber-200 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Redefinir senha</CardTitle>
          <CardDescription>Escolha uma nova senha para sua conta</CardDescription>
        </CardHeader>

        <CardContent>
          <Suspense fallback={null}>
            <ResetPasswordContent searchParams={searchParams} />
          </Suspense>
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
