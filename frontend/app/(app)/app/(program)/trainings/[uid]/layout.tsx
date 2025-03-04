import { getCurrentUser } from "@/app/(auth)/actions/auth"
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
import { AppSidebar } from "./sidebar"

export default async function Page({
  params,
  children,
}: {
  params: { uid: string }
  children: React.ReactNode
}) {
  const { uid } = await params
  const program = await fetchCMS({ path: `programs/${uid}` })
  const programs = await fetchCMS({ path: `programs` })

  const user = await getCurrentUser()

  if (!user) {
    redirect(`/register?redirectTo=/programs/${uid}/buy`)
  }

  const hasProgram = user.programs.find(
    (userProgram: Program) => userProgram.documentId === uid
  )

  if (!hasProgram) {
    redirect(`/programs/${uid}/buy`)
  }

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
            <header className="flex sticky top-0 bg-background h-10 md:h-16 shrink-0 items-center gap-2 border-b px-4">
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
