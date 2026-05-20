import { parseVideoUrl } from "@/lib/utils";

export function VideoPlayer({ url }: { url: string }) {
  const parsed = parseVideoUrl(url);
  if (!parsed) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl bg-dark-700 text-text-muted">
        Invalid video URL
      </div>
    );
  }

  const embedUrl =
    parsed.provider === "YOUTUBE"
      ? `https://www.youtube.com/embed/${parsed.id}?rel=0`
      : `https://player.vimeo.com/video/${parsed.id}`;

  return (
    <div className="aspect-video overflow-hidden rounded-xl border border-dark-600 bg-black">
      <iframe
        src={embedUrl}
        title="Course video"
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
