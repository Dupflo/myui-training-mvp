import { StaticImport } from "next/dist/shared/lib/get-img-props"
import Image from "next/image"

interface IntegrationCardProps {
  name: string
  description: string
  image: StaticImport
}

export default function IntegrationCard({
  name,
  description,
  image,
}: IntegrationCardProps) {
  return (
    <div className="bg-card rounded-xl shadow-md p-6 flex items-center transition-all duration-300 hover:shadow-lg">
      <div className="flex-shrink-0 mr-6">
        <Image
          src={image || "/placeholder.svg"}
          alt={`${name} logo`}
          className="max-h-[70px]"
        />
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2 text-card-foreground">{name}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
