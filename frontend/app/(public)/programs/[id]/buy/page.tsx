import { getCurrentUser } from "@/app/(auth)/actions/auth"
import { fetchCMS } from "@/utils/fetchers"
import { redirect } from "next/navigation"

export default async function BuyProgramPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getCurrentUser()
  const { id } = await params
  if (!user) redirect(`/checkout/${id}`)

  const program = await fetchCMS({
    path: `checkout/${id}`,
    method: "POST",
    body: { customerId: user.customer_id },
  })
  if (program.url) {
    redirect(program.url)
  }

  return null
}
