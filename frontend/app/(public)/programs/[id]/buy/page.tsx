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
  if (!user) redirect(`/register?redirectTo=/programs/${id}/buy`)

  const program = await fetchCMS({
    path: `programs/${id}/checkout`,
    method: "POST",
    body: { customerId: user.customer_id },
  })
  if (program.url) {
    redirect(program.url)
  }

  return null
}
