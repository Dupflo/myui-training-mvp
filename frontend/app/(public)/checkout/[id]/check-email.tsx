import {
  checkIfUserExist,
  generateCheckoutPage,
} from "@/app/(auth)/actions/auth"
import { FadeIn } from "@/components/fade-in"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useActionState } from "react"

export default function CheckEmail({ programId, setUser }: any) {
  const router = useRouter()
  const [, formAction] = useActionState(
    async (state: void, formData: FormData) => {
      const user = await checkIfUserExist(formData)
      if (user.email) {
        setUser(user)
      } else {
        const checkoutPage = await generateCheckoutPage({
          programId,
          email: formData.get("email") as string,
        })
        console.log(checkoutPage)
        if (checkoutPage) window.location.href = checkoutPage.url
      }
      // const response = await checkIfUserExist()
      // console.log(response)
      // return response
    },
    {}
  )

  return (
    <FadeIn>
      <form className="space-y-8 text-center" action={formAction}>
        <Label htmlFor="email" className="text-lg md:text-2xl font-semibold">
          <span className="font-bold">Step 1 :</span> Saisissez votre adresse
          e-mail
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          className="text-center"
          placeholder="m@example.com"
          required
          size="lg"
        />
        <Button
          type="submit"
          className="w-full uppercase font-semibold"
          size="lg"
        >
          Étape suivante
        </Button>
      </form>
    </FadeIn>
  )
}
