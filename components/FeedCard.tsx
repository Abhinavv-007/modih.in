import Link from "next/link";
import Image from "next/image";
import { TagPill } from "./TagPill";
import { PostSummary } from "@/lib/types";
import { EmbedPreview } from "./EmbedPreview";

const mediaHeight = "h-[60vh]";

export function FeedCard({ post }: { post: PostSummary }) {
  return (
    <article className="reel-item flex h-[88vh] w-full flex-col justify-between rounded-3xl border border-ink/10 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between text-xs text-ink/60">
        <span className="rounded-full bg-accent/10 px-3 py-1 font-semibold text-accent">
          {post.contentKind.replace("_", " ")}
        </span>
        <span>{post.publishedAtLabel}</span>
      </div>

      <div className={`mt-4 overflow-hidden rounded-2xl bg-ink/5 ${mediaHeight}`}>
        {post.mediaUrl && post.contentKind === "UPLOAD_VIDEO" ? (
          <video className="h-full w-full object-cover" controls playsInline>
            <source src={post.mediaUrl} />
          </video>
        ) : post.mediaUrl && post.contentKind === "UPLOAD_AUDIO" ? (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <p className="text-sm text-ink/60">Audio meme</p>
            <audio controls className="w-4/5">
              <source src={post.mediaUrl} />
            </audio>
          </div>
        ) : post.mediaUrl ? (
          <Image
            src={post.mediaUrl}
            alt={post.caption}
            width={900}
            height={1200}
            className="h-full w-full object-cover"
          />
        ) : post.embed ? (
          <EmbedPreview embed={post.embed} />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-ink/50">
            Media preview unavailable
          </div>
        )}
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-ink">{post.caption}</h3>
          <Link href={`/post/${post.id}`} className="text-sm font-semibold text-accent">
            View
          </Link>
        </div>
        {post.embed?.author && (
          <p className="text-xs text-ink/50">Source: {post.embed.author}</p>
        )}
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <TagPill key={tag} label={tag} />
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs text-ink/60">
          <span>{post.likeCount} likes</span>
          <span>{post.viewCount} views</span>
          <button className="ml-auto text-xs font-semibold text-ink/50 hover:text-ink">
            Report
          </button>
        </div>
      </div>
    </article>
  );
}
