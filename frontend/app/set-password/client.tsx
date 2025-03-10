"use client"

import { changeUserPassword } from "@/app/(auth)/actions/auth"
import { FadeIn, FadeInStagger } from "@/components/fade-in"
import Logo from "@/components/logo.png"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useActionState } from "react"

export default function SetPasswordPageClient({ user }) {
  const router = useRouter()
  const [, formAction] = useActionState(
    async (state: void, formData: FormData) => {
      await changeUserPassword(user, formData)
      router.refresh()
    },
    {}
  )

  return (
    <main className="flex flex-col h-screen ">
      <FadeInStagger className="max-w-3xl mx-auto py-20 space-y-10 my-auto p-4 md:p-0">
        <FadeIn>
          <Image
            src={Logo}
            alt="logo"
            className="w-40 mx-auto"
            quality={100}
            draggable={false}
          />
        </FadeIn>
        <FadeIn>
          <form className="space-y-5 text-center" action={formAction}>
            <h1 className="text-lg md:text-4xl font-semibold mb-5">
              🚀 Paiement validé ! Encore une petite étape
            </h1>
            <h2 className="text-lg md:text-2xl font-semibold">
              Pour accéder à ton espace d&lsquo;entrainement, nous avons besoin
              que tu créer un mot de passe 🔐
            </h2>
            <p className="text-md md:text-lg font-semibold">
              Si tu ne le fais pas maintenant, tu devras demander un lien de
              réinitialisation de mot de passe pour pouvoir te reconnecter 😅.
            </p>
            <p className="text-md md:text-lg font-semibold">
              Alors, accorde-toi ces quelques secondes 🙂
            </p>
            <Input
              id="password"
              name="password"
              type="password"
              className="text-center"
              required
              pattern=".{6,}"
              placeholder=" Entrez votre mot de passe"
              size="lg"
            />
            <Button
              type="submit"
              className="w-full uppercase font-semibold"
              size="lg"
            >
              Valider mon mot de passe
            </Button>
          </form>
        </FadeIn>
      </FadeInStagger>
    </main>
  )
}
