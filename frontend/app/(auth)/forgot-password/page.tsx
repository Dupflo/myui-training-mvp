"use client"

import { sendResetPasswordLink } from "@/app/(auth)/actions/auth"
import { AuthForm } from "@/components/login-form"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  return (
    <AuthForm
      title="Mot de passe oublié"
      description="Entrez votre email ci-dessous pour recevoir un lien de
          réinitialisation"
      fields={{
        email: { label: "Email" },
      }}
      buttonLabel="Envoyer le lien de réinitialisation"
      action={sendResetPasswordLink}
      bottom={{
        action: {
          name: "Tenter de se connecter",
          link: "/login",
        },
      }}
      confirmationMessage={
        <div className="flex flex-col space-y-2 text-md text-center">
          <CheckCircle className="size-16 mx-auto" />
          <p className="font-semibold text-base">
            Veuillez vérifier votre boîte de réception
          </p>
          <p>
            Si vous ne recevez pas cet e-mail dans quelques minutes, Vérifiez
            votre dossier spam. N’hésitez pas à refaire la demande ou à{" "}
            <Link href="mailto:contact@myui-training.com" className="underline">
              contacter notre support
            </Link>
            .
          </p>
        </div>
      }
    />
  )
}
