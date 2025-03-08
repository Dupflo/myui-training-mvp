"use client"

import { loggedUserFromSession } from "@/app/(auth)/actions/auth"
import { FadeIn } from "@/components/fade-in"
import Logo from "@/components/logo.png"
import { Program } from "@/contexts/program-context"
import Image from "next/image"
import { useEffect, useState } from "react"
import CheckEmail from "./check-email"
import SignUser from "./sign-user"

export default function CheckoutPageClient({
  program,
  sessionId,
}: {
  program: Program
  sessionId?: string
}) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      if (sessionId) {
        await loggedUserFromSession(sessionId as string)
      }
    }
    fetchUser()
  }, [sessionId])

  if (sessionId)
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
        <h1 className="text-4xl font-semibold">
          Préparation de l&lsquo;environnement
        </h1>
      </div>
    )
  return (
    <main className="flex flex-col min-h-screen py-10">
      <div className="max-w-2xl mx-auto space-y-5 p-4 md:p-0">
        {program.image && (
          <FadeIn className="relative aspect-video">
            <Image
              src={program.image.url}
              alt={program.title}
              fill
              className="rounded-lg max-w-md mx-auto shadow-lg object-cover object-center"
            />
          </FadeIn>
        )}
        <FadeIn className="text-center space-y-4">
          <h1 className="text-2xl md:text-4xl font-semibold whitespace-pre-wrap flex flex-wrap text-center justify-center">
            Rejoignez le programme{" "}
            <span className="font-bold">{program.title}</span>
          </h1>
        </FadeIn>
        {user ? (
          <SignUser user={user} />
        ) : (
          <CheckEmail programId={program.documentId} setUser={setUser} />
        )}
      </div>
      <footer className="mt-auto fixed bottom-0 w-full">
        <div className="bg-slate-100 text-slate-600 flex items-center justify-center gap-1 p-2">
          <p className="text-sm font-medium">Un programme propulsé avec</p>
          <Image
            src={Logo}
            alt="logo"
            className="w-24"
            quality={100}
            draggable={false}
          />
        </div>{" "}
      </footer>
    </main>
  )
}
