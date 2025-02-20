import Card, { CardProps } from "@/components/card"

export default async function Home() {
  const data = await fetch(`${process.env.API_URL}/api/programs`)
  const programs = await data.json()

  return (
    <div className="grid grid-cols-3 gap-20 py-40">
      {programs.data.map((program: CardProps) => (
        <Card key={program.documentId} data={program} />
      ))}
    </div>
  )
}
