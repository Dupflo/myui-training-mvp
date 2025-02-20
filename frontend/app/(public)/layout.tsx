import Header from "@/components/header"
import Footer from "@/components/footer"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-40">
        {children}
      </main>
      <Footer />
    </>
  )
}
