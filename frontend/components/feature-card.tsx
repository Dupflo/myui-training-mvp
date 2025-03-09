import type { ReactNode } from "react"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
}

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="bg-card rounded-xl shadow-md p-8 h-full transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-card-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
