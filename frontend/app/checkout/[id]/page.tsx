import { generateCheckoutPage, getCurrentUser } from "@/app/(auth)/actions/auth"
import { Program } from "@/contexts/program-context"
import { fetchCMS } from "@/utils/fetchers"
import { SearchParams } from "next/dist/server/request/search-params"
import { notFound, redirect } from "next/navigation"
import CheckoutPageClient from "./checkout-client"

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: SearchParams
}) {
  const user = await getCurrentUser()
  const { session_id } = await searchParams

  const { id } = await params

  const program = await fetchCMS({ path: `programs/${id}`, tags: [id] })
  if (!program) notFound()

  if (user) {
    const hasProgram = user.programs.find(
      (userProgram: Program) => userProgram.documentId === id
    )

    if (hasProgram) {
      redirect(`/app/trainings/${id}`)
    }

    const checkoutPage = await generateCheckoutPage({
      programId: id,
      customerId: user.customer_id,
    })

    if (checkoutPage.url) {
      redirect(checkoutPage.url)
    }
  }

  return (
    <CheckoutPageClient program={program} sessionId={session_id as string} />
  )
}
