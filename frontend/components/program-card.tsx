import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

import { User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"

interface ProgramCardProps {
  title: string
  description: string
  imageUrl: string
  author: string
  price: number
  category: string
  popular?: boolean
  link: string
}

export default function ProgramCard({
  title,
  description,
  imageUrl,
  author,
  category,
  popular = false,
  link,
}: ProgramCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
        />
        {popular && (
          <Badge className="absolute top-2 right-2 bg-amber-500 hover:bg-amber-700">
            Populaire
          </Badge>
        )}
        <Badge className="absolute top-2 left-2 bg-background text-foreground hover:bg-muted">
          {category}
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <h3 className="text-xl font-bold">{title}</h3>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center text-sm text-muted-foreground">
          <User className="h-4 w-4 mr-1" />
          <span>{author}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-4">
        {/* <span className="font-bold text-amber-500">
          {new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
          }).format(price)}
        </span> */}
        <Link href={link}>
          <Button variant="outline" size="sm">
            En savoir plus
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
