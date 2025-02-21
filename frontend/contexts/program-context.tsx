"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

export type Video = {
  id: number
  title: string
  media: {
    url: string
    provider: string
    providerUid: string
  }
}

export type Module = {
  id: number
  title: string
  description: string
  videos: Video[]
  color: string
}

export type Program = {
  id: number
  documentId: string
  title: string
  program_model: [
    {
      __component: string
      id: number
      modules: Module[]
    }
  ]
}

type ProgramContextType = {
  program: Program | null
  selectedModule: Module | null
  selectedVideo: Video | null
  setSelectedModule: (module: Module) => void
  setSelectedVideo: (video: Video) => void
}

const ProgramContext = createContext<ProgramContextType | undefined>(undefined)

export function ProgramProvider({
  children,
  initialProgram,
}: {
  children: React.ReactNode
  initialProgram: Program
}) {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    if (initialProgram) {
      const moduleIndex = Number.parseInt(searchParams.get("module") || "0", 10)
      const videoIndex = Number.parseInt(searchParams.get("video") || "0", 10)

      const module =
        initialProgram.program_model[0].modules[moduleIndex] ||
        initialProgram.program_model[0].modules[0]
      const video = module.videos[videoIndex] || module.videos[0]

      setSelectedModule(module)
      setSelectedVideo(video)
    }
  }, [initialProgram, searchParams])

  return (
    <ProgramContext.Provider
      value={{
        program: initialProgram,
        selectedModule,
        selectedVideo,
        setSelectedModule,
        setSelectedVideo,
      }}
    >
      {children}
    </ProgramContext.Provider>
  )
}

export function useProgram() {
  const context = useContext(ProgramContext)
  if (context === undefined) {
    throw new Error("useProgram must be used within a ProgramProvider")
  }
  return context
}
