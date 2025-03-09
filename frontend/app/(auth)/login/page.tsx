import { AuthForm } from "@/components/login-form"
import { SearchParams } from "next/dist/server/request/search-params"
import { redirect } from "next/navigation"
import { getCurrentUser, login } from "../actions/auth"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const search = await searchParams
  const redirectTo = search.redirectTo as string

  const user = await getCurrentUser()

  if (user) {
    if (redirectTo) {
      redirect(redirectTo)
    }
    if (user.programs.length > 0) {
      redirect(`/app/trainings/${user.programs[0].documentId}`)
    } else redirect("/#programs")
  }

  return (
    <AuthForm
      title="Accédez à votre compte"
      description=" Entrez votre email ci-dessous pour vous connecter à votre compte"
      fields={{
        email: { label: "Email" },
        password: { label: "Mot de passe", link: true },
      }}
      buttonLabel="Se connecter"
      action={login}
      bottom={{
        label: "Pas de compte ?",
        action: {
          name: "Découvrez nos programmes",
          link: `/programs`,
        },
      }}
    />
  )
}
