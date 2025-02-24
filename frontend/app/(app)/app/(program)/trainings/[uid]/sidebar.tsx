"use client"

import * as React from "react"
import { ChevronRight, CirclePlay } from "lucide-react"

import { VersionSwitcher } from "@/components/version-switcher"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/ui/nav-user"
import {
  Module,
  useProgram,
  Video as VideoProps,
} from "@/contexts/program-context"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { NavRessources } from "../../../../../../components/nav-resources"
import { useSearchParams } from "next/navigation"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  programs: any // Remplacez 'any' par le type approprié si vous le connaissez
  user: any
}

export function AppSidebar(props: AppSidebarProps) {
  const { programs, user, ...restProps } = props
  const { program, selectedVideo } = useProgram()
  const searchParams = useSearchParams()
  const [openCollapsible, setOpenCollapsible] = React.useState<Module | null>(
    null
  )

  return (
    <Sidebar {...restProps}>
      <SidebarHeader>
        <VersionSwitcher
          user={user}
          title={program?.title}
          programs={programs}
          defaultVersion={"test"}
        />
        {/* <SearchForm /> */}
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {/* We create a collapsible SidebarGroup for each parent. */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {program?.program_model[0].title}
          </SidebarGroupLabel>
          {program?.program_model[0].modules.map((module, moduleIndex) => (
            <Collapsible
              key={module.title}
              title={module.title}
              className="group/collapsible"
              open={
                openCollapsible?.id === module.id ||
                moduleIndex === Number(searchParams?.get("module")) ||
                (moduleIndex === 0 && !searchParams.has("module"))
              }
            >
              <SidebarGroup>
                <SidebarGroupLabel
                  asChild
                  className={cn(
                    moduleIndex % 2 ? "" : "bg-sidebar-accent",
                    "group/label text-sm text-sidebar-foreground  text-left hover:text-sidebar-accent-foreground"
                  )}
                >
                  <CollapsibleTrigger
                    onClick={() => {
                      if (openCollapsible?.id === module.id) {
                        setOpenCollapsible(null)
                      } else {
                        setOpenCollapsible(module)
                      }
                    }}
                  >
                    {module.color && (
                      <div
                        className="w-5 h-5 rounded-full mr-2 outline outline-1 outline-gray-200"
                        style={{ backgroundColor: module.color }}
                      />
                    )}
                    {module.title}{" "}
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {module.videos.map(
                        (video: VideoProps, videoIndex: number) => (
                          <SidebarMenuItem
                            key={video.title}
                            className={videoIndex === 0 ? "mt-1" : ""}
                          >
                            <SidebarMenuButton
                              asChild
                              isActive={video.id === selectedVideo?.id}
                            >
                              <Link
                                href={`?module=${moduleIndex}&video=${videoIndex}`}
                              >
                                <CirclePlay /> {video.title}
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )
                      )}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          ))}
        </SidebarGroup>
        {program?.program_model[1] && (
          <NavRessources
            title={program?.program_model[1].title}
            projects={program?.program_model[1].resources}
          />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
