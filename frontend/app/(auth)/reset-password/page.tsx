import {
  getCurrentUser,
  resetPasswordAndSignIn,
} from "@/app/(auth)/actions/auth"
import { AuthForm } from "@/components/login-form"
import { SearchParams } from "next/dist/server/request/search-params"
import { redirect } from "next/navigation"

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const user = await getCurrentUser()

  if (user) {
    redirect("/login")
  }

  const { code } = await searchParams

  if (!code) redirect("/forgot-password")

  return (
    <AuthForm
      title="Réinitialiser le mot de passe"
      description="Choisissez un nouveau mot de passe de 6 caractères minimum."
      fields={{
        password: { label: "Mot de passe" },
        hidden: { name: "code", value: code as string },
      }}
      buttonLabel="Confirmer le nouveau mot de passe"
      action={resetPasswordAndSignIn}
    />
  )
}
