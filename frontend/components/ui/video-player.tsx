import { Video } from "@/contexts/program-context"

export default function VideoPlayer({ video }: { video: Video }) {
  if (video.media.provider === "vimeo") {
    return (
      <div className="w-full mx-auto shadow">
        <iframe
          src={`https://player.vimeo.com/video/${video.media.providerUid}?autoplay=1&title=0&byline=0&portrait=0`}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full aspect-video"
        ></iframe>
      </div>
    )
  }

  if (video.media.provider === "youtube") {
    return (
      <div className="max-w-4xl mx-auto shadow">
        <iframe
          src={`https://www.youtube.com/embed/${video.media.providerUid}?autoplay=1&modestbranding=1&showinfo=0&rel=0`}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full aspect-video"
        ></iframe>
      </div>
    )
  }

  // Add support for other video providers here if needed

  return <div>Unsupported video provider</div>
}
