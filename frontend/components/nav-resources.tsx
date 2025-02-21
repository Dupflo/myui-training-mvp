"use client"
import {
  type LucideIcon,
  Book,
  Dumbbell,
  FileText,
  LucideFacebook,
  Link2,
  Sheet,
  Download,
  ExternalLink,
  Loader,
} from "lucide-react"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  // SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { useState } from "react"

const iconMapping: Record<string, LucideIcon> = {
  Livre: Book,
  Haltère: Dumbbell,
  PDF: FileText,
  Excel: Sheet,
  Facebook: LucideFacebook,
}

export function NavRessources({
  title,
  projects,
}: {
  title: string
  projects: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const [loading, setLoading] = useState<string | null>(null)

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => {
          const IconComponent = iconMapping[item.icon] || Link2
          return (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton asChild>
                {(item.media || item.link) && (
                  <Link
                    href={item.link || item.media.url}
                    target="_blank"
                    onClick={(e) => {
                      if (item.media) {
                        e.preventDefault()
                        setLoading(item.media.documentId)
                        fetch(item.media.url)
                          .then((response) => response.blob())
                          .then((blob) => {
                            const url = window.URL.createObjectURL(blob)
                            const a = document.createElement("a")
                            a.href = url
                            a.download = item.media.name || "download"
                            document.body.appendChild(a)
                            a.click()
                            a.remove()
                            window.URL.revokeObjectURL(url)
                          })
                          .catch(console.error)
                          .finally(() => setLoading(null))
                      }
                    }}
                  >
                    <IconComponent />
                    <span>{item.title}</span>
                    {loading && loading === item.media?.documentId ? (
                      <Loader className="!size-4 animate-spin ml-auto" />
                    ) : (
                      <>
                        {item.media && <Download className="!size-4 ml-auto" />}
                        {item.link && (
                          <ExternalLink className="!size-4 ml-auto" />
                        )}
                      </>
                    )}
                  </Link>
                )}
              </SidebarMenuButton>
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem>
                    <Folder className="text-muted-foreground" />
                    <span>View Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Forward className="text-muted-foreground" />
                    <span>Share Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Trash2 className="text-muted-foreground" />
                    <span>Delete Project</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> */}
            </SidebarMenuItem>
          )
        })}
        {/* <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem> */}
      </SidebarMenu>
    </SidebarGroup>
  )
}
