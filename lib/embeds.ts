import type { EmbedData } from "./types";

const ALLOWED_IFRAME_HOSTS = new Set([
  "www.youtube.com",
  "youtube.com",
  "youtu.be",
  "www.tiktok.com",
  "www.reddit.com",
  "www.redditmedia.com",
  "redditmedia.com",
  "reddit.com",
  "www.instagram.com",
  "instagram.com",
  "www.facebook.com",
  "facebook.com",
  "www.facebook.com/plugins"
]);

export function isAllowedEmbedUrl(urlString?: string) {
  if (!urlString) return false;
  try {
    const url = new URL(urlString);
    return ALLOWED_IFRAME_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

export function extractIframeSrc(html?: string) {
  if (!html) return undefined;
  const match = html.match(/<iframe[^>]+src=[\"']([^\"']+)[\"'][^>]*>/i);
  if (!match) return undefined;
  const src = match[1];
  return isAllowedEmbedUrl(src) ? src : undefined;
}

export function getEmbedLabel(embed?: EmbedData) {
  if (!embed) return "Embed";
  const map: Record<EmbedData["embedType"], string> = {
    youtube: "YouTube",
    tiktok: "TikTok",
    reddit: "Reddit",
    instagram: "Instagram",
    facebook: "Facebook"
  };
  return map[embed.embedType];
}
