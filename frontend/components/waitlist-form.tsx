"use client"

import { addUserToWaitList } from "@/app/(auth)/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useActionState, useState } from "react"
import { toast } from "sonner"

export default function WaitlistForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  // const [formData, setFormData] = useState({
  //   name: "",
  //   email: "",
  //   company: "",
  // })

  const [, formAction] = useActionState(
    async (state: void, formData: FormData) => {
      setIsSubmitting(true)
      const res = await addUserToWaitList(formData)
      if (res.response.statusCode === 201) {
        toast.success("Inscription réussie !", {
          description:
            "Vous êtes maintenant sur notre liste d'attente. Nous vous contacterons bientôt lors du lancement officiel.",
          duration: 5000,
          position: "bottom-center",
        })
      } else if (res.response.body.code === "duplicate_parameter") {
        toast.error("Échec", {
          description:
            "Vous êtes déjà sur notre liste d'attente. Nous vous contacterons bientôt lors du lancement officiel.",
          duration: 5000,
          position: "bottom-center",
        })
      }

      setIsSubmitting(false)
    },
    {
      name: "",
      email: "",
      company: "",
    }
  )

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target
  //   setFormData((prev) => ({ ...prev, [name]: value }))
  // }

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   setIsSubmitting(true)

  //   // Simuler un appel API
  //   setTimeout(() => {
  //     setIsSubmitting(false)
  //     toast.success("Inscription réussie !", {
  //       description:
  //         "Vous êtes maintenant sur notre liste d'attente. Nous vous contacterons bientôt lors du lancement officiel.",
  //       duration: 5000,
  //       position: "bottom-center",
  //     })
  //     setFormData({ name: "", email: "", company: "" })
  //   }, 1500)
  // }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="name">Nom complet</Label>
        <Input id="name" name="name" placeholder="Votre nom" required />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="votre@email.com"
          required
        />
      </div>

      <div>
        <Label htmlFor="company">Entreprise (optionnel)</Label>
        <Input
          id="company"
          name="company"
          placeholder="Nom de votre entreprise"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-amber-500 hover:bg-amber-700 text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Inscription en cours...
          </>
        ) : (
          "S'inscrire à la liste d'attente"
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center mt-4">
        En vous inscrivant, vous acceptez de recevoir des emails concernant MYUI
        Training. Nous respectons votre vie privée et ne partagerons jamais vos
        informations.
      </p>
    </form>
  )
}
