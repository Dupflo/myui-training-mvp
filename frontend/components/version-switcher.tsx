"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Program } from "@/contexts/program-context"
import { Check, ChevronsUpDown, GalleryVerticalEnd, Lock } from "lucide-react"
import Link from "next/link"
import * as React from "react"

export function VersionSwitcher({
  title,
  user,
  programs,
  defaultVersion,
}: {
  user: any
  title: string
  programs: string[]
  defaultVersion: string
}) {
  const hasProgram = React.useCallback(
    (program: Program) =>
      user.programs.find(
        (useProgram) => useProgram.documentId === program.documentId
      ),
    [user.programs]
  )

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">{title}</span>
                {/* <span className="">{selectedVersion}</span> */}
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width]"
            align="start"
          >
            {programs.map((program) => (
              <Link
                key={program.id}
                href={`/app/trainings/${program.documentId}`}
              >
                <DropdownMenuItem>
                  {program.title}

                  {program.title === title && <Check className="ml-auto" />}
                  {!hasProgram(program) && <Lock />}
                </DropdownMenuItem>
              </Link>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
