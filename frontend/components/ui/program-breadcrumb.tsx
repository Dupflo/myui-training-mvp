"use client"

import React from "react"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useProgram } from "@/contexts/program-context"
import { useSidebar } from "./sidebar"

export default function ProgramBreadcrumb() {
  const { program, selectedModule, selectedVideo } = useProgram()
  const { isMobile } = useSidebar()
  if (program && selectedModule && selectedVideo) {
    if (isMobile) {
      return (
        <Breadcrumb className="ml-auto">
          <BreadcrumbList>
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="max-w-xs ">
                  <DropdownMenuItem>{program.title}</DropdownMenuItem>
                  <DropdownMenuItem>{selectedModule.title}</DropdownMenuItem>
                  <DropdownMenuItem>{selectedVideo.title}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )
    } else
      return (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink>{program.title}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbLink>{selectedModule.title}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{selectedVideo.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )
  }

  return null
}
