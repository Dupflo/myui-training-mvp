import Card, { CardProps } from "@/components/card"
import { fetchCMS } from "@/utils/fetchers"
import { redirect } from "next/navigation"

export default async function Home() {
  redirect("/login")
  const programs = await fetchCMS({ path: "programs" })

  return (
    <div className="grid grid-cols-3 gap-20 py-40">
      {programs.map((program: CardProps) => (
        <Card key={program.documentId} data={program} />
      ))}
    </div>
  )
}
