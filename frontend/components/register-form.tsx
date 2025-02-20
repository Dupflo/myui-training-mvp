"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useFormStatus } from "react-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type React from "react"
import { register } from "@/app/(auth)/actions/auth"
import Link from "next/link"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Connexion..." : "Se connecter"}
    </Button>
  )
}

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [state, formAction] = useActionState(register, null)
  const router = useRouter()

  console.log(state)

  useEffect(() => {
    if (state && state.success) {
      router.push("/profile")
    }
  }, [state, router])

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      action={formAction}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Créer votre compte</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Entrez votre email ci-dessous pour créer votre compte
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="string"
            placeholder="m@example.com"
            required
            error={state?.errors}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Mot de passe</Label>
            <Link
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            required
            error={state?.errors}
          />
        </div>
        <SubmitButton />
        {state && state.error && (
          <p className="text-sm text-red-500">{state.error}</p>
        )}
      </div>
      <div className="text-center text-sm">
        Vous avez un compte ?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Créer mon compte
        </Link>
      </div>
    </form>
  )
}
