"use client"

import { changeUserPassword } from "@/app/(auth)/actions/auth"
import { FadeIn, FadeInStagger } from "@/components/fade-in"
import Logo from "@/components/logo.png"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useActionState } from "react"

export default function SetPasswordPageClient({ user }) {
  const router = useRouter()
  const [, formAction] = useActionState(
    async (state: void, formData: FormData) => {
      console.log(user)
      await changeUserPassword(user, formData)
      router.refresh()
    },
    {}
  )

  return (
    <main className="flex flex-col h-screen ">
      <FadeInStagger className="max-w-2xl mx-auto py-20 space-y-10 my-auto p-4 md:p-0">
        <FadeIn>
          <Image
            src={Logo}
            alt="logo"
            className="w-24"
            quality={100}
            draggable={false}
          />
        </FadeIn>
        <FadeIn>
          <form className="space-y-8 text-center" action={formAction}>
            <h3 className="text-lg md:text-xl font-semibold mb-5 text-slate-400">
              Il existe déjà un compte pour cet utilisateur
            </h3>
            <Label
              htmlFor="password"
              className="text-lg md:text-2xl font-semibold"
            >
              Saisissez votre mot de passe
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              className="text-center"
              required
              placeholder=" Entrez votre mot de passe"
            />
            <Button
              type="submit"
              className="w-full uppercase font-semibold"
              size="lg"
            >
              Se connecter et passer au paiement
            </Button>
          </form>
        </FadeIn>
      </FadeInStagger>
    </main>
  )
}
