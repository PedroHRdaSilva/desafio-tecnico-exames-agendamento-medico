import Link from "next/link";

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
  params: Promise<{ token: string }>;
};

export default async function ResetPasswordPage({
  params,
}: ResetPasswordPageProps) {
  const { token } = await params;

  return (
    <div className="flex min-h-screen items-center justify-center bg-amber-200 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Redefinir senha</CardTitle>
          <CardDescription>Escolha uma nova senha para sua conta</CardDescription>
        </CardHeader>

        <CardContent>
          <ResetPasswordForm token={token} />
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
