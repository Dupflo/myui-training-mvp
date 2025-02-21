import { getCurrentUser } from "@/app/(auth)/actions/auth"
import { AppSidebar } from "@/components/app-sidebar"
import ProgramBreadcrumb from "@/components/ui/program-breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Program, ProgramProvider } from "@/contexts/program-context"
import { fetchCMS } from "@/utils/fetchers"
import { redirect } from "next/navigation"

export default async function Page({
  params,
  children,
}: {
  params: { uid: string }
  children: React.ReactNode
}) {
  const program = await fetchCMS({ path: `programs/${params.uid}` })
  const programs = await fetchCMS({ path: `programs` })

  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const hasProgram = user.programs.find(
    (userProgram: Program) => userProgram.documentId === params.uid
  )

  if (hasProgram && program && programs)
    return (
      <ProgramProvider initialProgram={program}>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "380px",
            } as React.CSSProperties
          }
        >
          <AppSidebar programs={programs} user={user} />
          <SidebarInset>
            <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <ProgramBreadcrumb />
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </ProgramProvider>
    )
  return <p>Nada</p>
}
