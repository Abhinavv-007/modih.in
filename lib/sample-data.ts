import { PostSummary } from "./types";

export const samplePosts: PostSummary[] = [
  {
    id: "demo-1",
    caption: "Fiscal fireworks in 15 seconds",
    tags: ["budget", "parody", "policy"],
    contentKind: "EMBED_YOUTUBE",
    embed: {
      embedType: "youtube",
      sourceUrl: "https://www.youtube.com/shorts/dQw4w9WgXcQ",
      canonicalUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      title: "Sample short"
    },
    likeCount: 1240,
    viewCount: 32100,
    publishedAtLabel: "2h ago"
  },
  {
    id: "demo-2",
    caption: "Press conference remix",
    tags: ["remix", "speech"],
    contentKind: "UPLOAD_IMAGE",
    mediaUrl: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=1200&auto=format&fit=crop",
    likeCount: 892,
    viewCount: 12004,
    publishedAtLabel: "Today"
  },
  {
    id: "demo-3",
    caption: "Comment section diplomacy",
    tags: ["reels", "debate"],
    contentKind: "EMBED_REDDIT",
    embed: {
      embedType: "reddit",
      sourceUrl: "https://www.reddit.com/r/politics/comments/abc123/",
      canonicalUrl: "https://www.redditmedia.com/r/politics/comments/abc123"
    },
    likeCount: 322,
    viewCount: 5400,
    publishedAtLabel: "Yesterday"
  }
];
