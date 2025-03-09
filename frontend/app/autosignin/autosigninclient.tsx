"use client"

import { loggedUserFromEmail } from "@/app/(auth)/actions/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AutosigninClient({ email }: { email: string }) {
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      if (email) {
        await loggedUserFromEmail(email as string)
        router.push("/login")
      }
    }
    fetchUser()
  }, [email])

  return (
    <div className="flex items-center justify-center gap-2 h-screen">
      <svg
        className="h-8 w-8 mt-0.5 animate-spin text-black"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <h1 className="text-4xl font-semibold">Chargement</h1>
    </div>
  )
}
