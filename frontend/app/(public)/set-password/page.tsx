import { getCurrentUser } from "@/app/(auth)/actions/auth"
import { SearchParams } from "next/dist/server/request/search-params"
import { redirect } from "next/navigation"
import SetPasswordPageClient from "./client"

export default async function SetPasswordPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const user = await getCurrentUser()
  if (!user) redirect("/")
  else if (user.createdPassword) {
    const search = await searchParams
    const redirectTo = search.redirectTo as string
    if (redirectTo) {
      redirect(redirectTo)
    } else redirect("/app")
  }
  return <SetPasswordPageClient user={user} />
}
