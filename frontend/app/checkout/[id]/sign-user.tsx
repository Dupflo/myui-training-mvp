"use client"

import { login } from "@/app/(auth)/actions/auth"
import { FadeIn } from "@/components/fade-in"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useActionState } from "react"

export default function SignUser({ user }) {
  const [state, formAction] = useActionState(
    async (state: void, formData: FormData) => {
      const response = await login(null, formData)
      return response
    },
    {}
  )

  return (
    <FadeIn>
      <form className="space-y-8 text-center" action={formAction}>
        <h3 className="text-lg md:text-xl font-semibold mb-5 text-slate-400">
          Il existe déjà un compte pour cet utilisateur
        </h3>
        <Label htmlFor="password" className="text-lg md:text-2xl font-semibold">
          Saisissez votre mot de passe
        </Label>
        <Input
          id="email"
          name="email"
          type="hidden"
          className="!mt-0"
          required
          defaultValue={user.email}
        />
        <div>
          {state.error && (
            <div className="flex flex-wrap mb-5 relative justify-between lg:justify-center items-center">
              <p className=" text-red-600">{state.error}</p>
              <Link
                href="/forgot-password"
                className="underline lg:absolute right-0"
              >
                Mot de passe oublié ?
              </Link>
            </div>
          )}
          <Input
            id="password"
            name="password"
            type="password"
            className="text-center"
            size="lg"
            required
            placeholder=" Entrez votre mot de passe"
          />
        </div>
        <Button
          type="submit"
          className="w-full uppercase font-semibold"
          size="lg"
        >
          Se connecter et passer au paiement
        </Button>
      </form>
    </FadeIn>
  )
}
