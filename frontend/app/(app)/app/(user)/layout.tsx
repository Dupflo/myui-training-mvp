import { getCurrentUser } from "@/app/(auth)/actions/auth"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { fetchCMS } from "@/utils/fetchers"
import { ReactNode } from "react"
import { AppSidebar } from "./app-sidebar"

export default async function DashboardLayoyt({
  children,
}: {
  children: ReactNode
}) {
  const user = await getCurrentUser()
  const programs = await fetchCMS({ path: `programs`, tags: ["programs"] })

  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar programs={programs} user={user} />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
