"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useFormStatus } from "react-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type React from "react"
import { login } from "@/app/(auth)/actions/auth"
import Link from "next/link"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Connexion..." : "Se connecter"}
    </Button>
  )
}

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [state, formAction] = useActionState(login, null)
  const router = useRouter()

  useEffect(() => {
    if (state && state.success) {
      router.push("/app/yec6f7nxucoqpx63yopl5ezf")
    }
  }, [state, router])

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      action={formAction}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Accédez à votre compte</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Entrez votre email ci-dessous pour vous connecter à votre compte
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="identifier"
            type="email"
            placeholder="m@example.com"
            required
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
          <Input id="password" name="password" type="password" required />
        </div>
        <SubmitButton />
        {state && state.error && (
          <p className="text-sm text-red-500">{state.error}</p>
        )}
      </div>
      <div className="text-center text-sm">
        Vous n&apos;avez pas de compte ?{" "}
        <Link href="/register" className="underline underline-offset-4">
          S&apos;inscrire
        </Link>
      </div>
    </form>
  )
}
