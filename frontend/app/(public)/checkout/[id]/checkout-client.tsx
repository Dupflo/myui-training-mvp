"use client"

import { FadeIn } from "@/components/fade-in"
import Logo from "@/components/logo.png"
import Image from "next/image"
import { useState } from "react"
import CheckEmail from "./check-email"
import SignUser from "./sign-user"

export default function CheckoutPageClient({ program }) {
  const [user, setUser] = useState(null)

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
        {user ? <SignUser user={user} /> : <CheckEmail setUser={setUser} />}
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
