"use client"

import Logo from "@/components/logo.png"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { NavUser } from "@/components/ui/nav-user"
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
  useSidebar,
} from "@/components/ui/sidebar"
import { VersionSwitcher } from "@/components/version-switcher"
import {
  Module,
  useProgram,
  Video as VideoProps,
} from "@/contexts/program-context"
import { cn } from "@/lib/utils"
import { ChevronRight, CirclePlay } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import * as React from "react"
import { NavRessources } from "../../../../../../components/nav-resources"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  programs: any // Remplacez 'any' par le type approprié si vous le connaissez
  user: any
}

export function AppSidebar(props: AppSidebarProps) {
  const { programs, user, ...restProps } = props
  const { program, selectedVideo } = useProgram()
  const { setOpenMobile } = useSidebar()
  const [openCollapsible, setOpenCollapsible] = React.useState<Module | null>(
    null
  )

  return (
    <Sidebar {...restProps}>
      <SidebarHeader>
        <Image
          src={Logo}
          alt="logo"
          className="mx-auto px-2 w-36"
          quality={100}
          draggable={false}
        />
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
              open={openCollapsible?.id === module.id}
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
                            onClick={() => {
                              setOpenMobile(false)
                            }}
                          >
                            <SidebarMenuButton
                              asChild
                              isActive={video.id === selectedVideo?.id}
                            >
                              <Link
                                href={`?module=${moduleIndex}&video=${videoIndex}`}
                              >
                                <CirclePlay /> {video.title}
                                {video.color && (
                                  <div
                                    className="w-5 h-5 rounded-full mr-2 outline outline-1 outline-gray-200"
                                    style={{ backgroundColor: module.color }}
                                  />
                                )}
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
