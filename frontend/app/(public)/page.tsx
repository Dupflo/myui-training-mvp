import Card, { CardProps } from "@/components/card"
import { fetchCMS } from "@/utils/fetchers"

export default async function Home() {
  const programs = await fetchCMS({ path: "programs" })

  return (
    <div className="grid grid-cols-3 gap-20 py-40">
      {programs.map((program: CardProps) => (
        <Card key={program.documentId} data={program} />
      ))}
    </div>
  )
}
