import { AuthForm } from "@/components/login-form"
import { SearchParams } from "next/dist/server/request/search-params"
import { redirect } from "next/navigation"
import { getCurrentUser, register } from "../actions/auth"

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const search = await searchParams
  const redirectTo = search.redirectTo as string
  const params = new URLSearchParams(search as Record<string, string>)

  const user = await getCurrentUser()

  if (user) {
    if (redirectTo) {
      redirect(redirectTo)
    }
    if (user.programs.length > 0) {
      redirect(`/app/trainings/${user.programs[0].documentId}`)
    } else redirect("/programs")
  }

  return (
    <AuthForm
      title="Step 1: Créer votre compte"
      description="Vous serez ensuite redirigé vers l'achat de votre programme"
      fields={{
        firstname: { label: "Prénom" },
        lastname: { label: "Nom" },
        email: { label: "Email" },
        password: { label: "Mot de passe" },
      }}
      buttonLabel="S'inscrire"
      action={register}
      actionRedirectUrl={redirectTo}
      bottom={{
        label: "Vous avez déjà un compte ?",
        action: {
          name: "Connectez-vous",
          link: `/login${
            params && `?${decodeURIComponent(params.toString())}`
          }`,
        },
      }}
    />
  )
}
