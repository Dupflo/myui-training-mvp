export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <main className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-20">
        {children}
      </main>
    </>
  )
}
