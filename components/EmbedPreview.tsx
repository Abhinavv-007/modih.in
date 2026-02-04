import { EmbedData } from "@/lib/types";
import { extractIframeSrc, getEmbedLabel, isAllowedEmbedUrl } from "@/lib/embeds";

export function EmbedPreview({ embed }: { embed: EmbedData }) {
  const iframeSrc = embed.canonicalUrl && isAllowedEmbedUrl(embed.canonicalUrl)
    ? embed.canonicalUrl
    : extractIframeSrc(embed.html);

  if (!iframeSrc) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-ink/60">
        <span>{getEmbedLabel(embed)} embed unavailable</span>
        <span className="text-xs">Unavailable</span>
      </div>
    );
  }

  return (
    <iframe
      title={embed.title || `${getEmbedLabel(embed)} embed`}
      src={iframeSrc}
      className="h-full w-full"
      sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
      referrerPolicy="no-referrer"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    />
  );
}
