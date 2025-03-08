import { getCurrentUser } from "@/app/(auth)/actions/auth"
import { Program } from "@/contexts/program-context"
import { fetchCMS } from "@/utils/fetchers"
import { notFound, redirect } from "next/navigation"
import CheckoutPageClient from "./checkout-client"

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getCurrentUser()

  const { id } = await params

  const data = await fetch(`${process.env.API_URL}/programs/${id}`)
  if (!data.ok) notFound()

  const program = await data.json()

  if (user) {
    const hasProgram = user.programs.find(
      (userProgram: Program) => userProgram.documentId === id
    )

    if (hasProgram) {
      redirect(`/app/trainings/${id}`)
    }

    const checkoutPage = await fetchCMS({
      path: `programs/${id}/checkout`,
      method: "POST",
      body: { customerId: user.customer_id },
    })
    if (checkoutPage.url) {
      redirect(checkoutPage.url)
    }
  }

  return <CheckoutPageClient program={program} />
}
