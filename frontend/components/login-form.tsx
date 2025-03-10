"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ReactNode, useActionState, useEffect, useState } from "react"
import { useFormStatus } from "react-dom"

interface FieldProps {
  label: string
  link?: boolean
}

interface AuthFormProps {
  title: string
  description: string
  fields: {
    firstname?: FieldProps
    lastname?: FieldProps
    email?: FieldProps
    password?: FieldProps
    hidden?: { name: string; value: string }
  }
  buttonLabel: string
  action: (prevState: unknown, formData: FormData) => Promise<unknown>
  bottom?: {
    label?: string
    action: {
      name: string
      link: string
    }
  }
  actionRedirectUrl?: string
  confirmationMessage?: ReactNode
}

function SubmitButton({ label }: { label: AuthFormProps["buttonLabel"] }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Patientez..." : label}
    </Button>
  )
}

export function AuthForm({
  title,
  description,
  action,
  fields,
  buttonLabel,
  bottom,
  actionRedirectUrl,
  confirmationMessage,
}: AuthFormProps) {
  const [success, setSuccess] = useState(false)
  const [state, formAction] = useActionState(action, null)

  const router = useRouter()

  useEffect(() => {
    if ((state as { success: boolean })?.success) {
      setSuccess(true)
      if (actionRedirectUrl) {
        router.push(actionRedirectUrl)
      }
    }
  }, [state])

  if (success && confirmationMessage) return confirmationMessage
  return (
    <form className={cn("flex flex-col gap-6")} action={formAction}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-balance text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="grid gap-6">
        {fields.firstname && (
          <div className="grid gap-2">
            <Label htmlFor="firstname">{fields.firstname.label}</Label>
            <Input id="firstname" name="firstname" type="text" required />
          </div>
        )}
        {fields.lastname && (
          <div className="grid gap-2">
            <Label htmlFor="lastname">{fields.lastname.label}</Label>
            <Input id="lastname" name="lastname" type="text" required />
          </div>
        )}
        {fields.email && (
          <div className="grid gap-2">
            <Label htmlFor="email">{fields.email.label}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
        )}
        {fields.password && (
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">{fields.password.label}</Label>
              {fields.password.link && (
                <Link
                  href="/forgot-password"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              )}
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              pattern=".{6,}"
              required
            />
          </div>
        )}
        {fields.hidden && (
          <Input
            type="hidden"
            name={fields.hidden.name}
            value={fields.hidden.value}
          />
        )}
        <SubmitButton label={buttonLabel} />
        {state && state.error && (
          <p className="text-sm text-red-500">{state.error}</p>
        )}
      </div>
      {bottom && (
        <div className="text-center text-sm">
          {bottom.label && `${bottom.label}${" "}`}
          <Link
            href={bottom.action.link}
            className="underline underline-offset-4"
          >
            {bottom.action.name}
          </Link>
        </div>
      )}
    </form>
  )
}
