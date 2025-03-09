"use client"

import { useProgram } from "@/contexts/program-context"
import Markdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"
import VideoPlayer from "./video-player"

export default function ProgramView() {
  const { program, selectedModule, selectedVideo } = useProgram()

  if (program && selectedVideo && selectedModule)
    return (
      <div className="flex h-screen max-w-5xl w-full mx-auto ">
        <main className="flex-1 md:px-6 py-2 overflow-auto">
          <div className="space-y-6">
            <h1 className="text-xl md:text-4xl font-semibold mb-2 text-center">
              {selectedVideo.title}
            </h1>
            {selectedVideo.media && <VideoPlayer video={selectedVideo} />}
            {selectedModule.description && (
              <div className="w-full max-w-full prose bg-sidebar p-5 rounded-md">
                <Markdown
                  rehypePlugins={[rehypeRaw]}
                  remarkPlugins={[remarkGfm]}
                >
                  {selectedModule.description}
                </Markdown>
              </div>
            )}
          </div>
        </main>
      </div>
    )
  return null
}
