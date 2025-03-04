import Logo from "@/components/logo.png"
import Image from "next/image"

export default async function AuhtLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Image
            src={Logo}
            alt="logo"
            className="w-44"
            quality={100}
            draggable={false}
          />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block bg-slate-100"></div>
    </div>
  )
}
