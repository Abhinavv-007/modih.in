export type ContentKind =
  | "UPLOAD_IMAGE"
  | "UPLOAD_GIF"
  | "UPLOAD_VIDEO"
  | "UPLOAD_AUDIO"
  | "EMBED_YOUTUBE"
  | "EMBED_TIKTOK"
  | "EMBED_REDDIT"
  | "EMBED_INSTAGRAM"
  | "EMBED_FACEBOOK";

export type PostStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface EmbedData {
  embedType: "youtube" | "tiktok" | "reddit" | "instagram" | "facebook";
  sourceUrl: string;
  canonicalUrl?: string;
  html?: string;
  title?: string;
  author?: string;
  thumbnail?: string;
}

export interface PostSummary {
  id: string;
  caption: string;
  tags: string[];
  contentKind: ContentKind;
  mediaUrl?: string;
  embed?: EmbedData;
  likeCount: number;
  viewCount: number;
  publishedAtLabel: string;
}
