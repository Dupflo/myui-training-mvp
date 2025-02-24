"use client"

import * as React from "react"
import {
  AudioWaveform,
  Command,
  File,
  LifeBuoy,
  Send,
  User,
} from "lucide-react"

import { NavMain } from "@/components/user/nav-main"
import { NavSecondary } from "@/components/user/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { TeamSwitcher } from "@/components/user/team-switcher"
import { NavUser } from "@/components/ui/nav-user"
import { navMain } from "@/lib/data"

const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: Command,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  programs: any // Remplacez 'any' par le type approprié si vous le connaissez
  user: any
}

export function AppSidebar(props: AppSidebarProps) {
  const { programs, user } = props

  return (
    <Sidebar
      className="top-[--header-height] !h-[calc(100svh-var(--header-height))]"
      {...props}
    >
      <SidebarHeader>
        <TeamSwitcher teams={programs} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
