import Link from "next/link"

export interface CardProps {
  id: number
  documentId: string
  image: { url: string }
  title: string
  description: string
  content: string
  price: number
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export default function Card({ data }: { data: CardProps }) {
  return (
    <Link href={`/app/trainings/${data.documentId}`} className="block">
      <img
        alt=""
        src={data.image.url}
        className="h-56 w-full rounded-bl-3xl rounded-tr-3xl object-cover sm:h-64 lg:h-72"
      />

      <div className="mt-4 sm:flex sm:items-center sm:justify-center sm:gap-4">
        <strong className="font-medium">{data.title}</strong>

        <span className="hidden sm:block sm:h-px sm:w-8 sm:bg-amber-500"></span>

        <p className="mt-0.5 opacity-50 sm:mt-0">
          {new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
          }).format(data.price)}
        </p>
      </div>
    </Link>
  )
}
