"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function CtaProgramCard() {
  const scrollToWaitlist = () => {
    const waitlistSection = document.getElementById("waitlist")
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-dashed border-2 border-amber-300 dark:border-amber-600">
      <div className="mb-6">
        <PlusCircle className="h-16 w-16 text-amber-500 mx-auto" />
      </div>
      <h3 className="text-xl font-bold mb-4">
        Toi aussi propose ton programme sur notre plateforme
      </h3>
      <p className="text-muted-foreground mb-6">
        Rejoins notre communauté de créateurs et partage ton expertise avec le
        monde entier grâce à notre plateforme optimisée pour la conversion.
      </p>
      <Link href="#waitlist">
        <Button className="bg-amber-500 hover:bg-amber-600 text-white">
          Rejoindre la liste d'attente
        </Button>
      </Link>
    </Card>
  )
}
