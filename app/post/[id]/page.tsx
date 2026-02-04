import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { EmbedPreview } from "@/components/EmbedPreview";
import { samplePosts } from "@/lib/sample-data";

export async function generateMetadata(): Promise<Metadata> {
  const post = samplePosts[0];
  return {
    title: `${post.caption} | modih.in`,
    openGraph: {
      title: post.caption,
      description: "Political satire meme on modih.in",
      images: post.mediaUrl ? [post.mediaUrl] : undefined
    }
  };
}

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const post = samplePosts[0];
  const postId = params.id;

  return (
    <section className="mx-auto w-full max-w-5xl px-5 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/feed" className="text-sm font-semibold text-accent">
            Back to feed
          </Link>
          <button className="rounded-full border border-ink/20 px-4 py-2 text-sm">
            Report
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-soft">
          <div className="relative aspect-[4/5] bg-ink/5">
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
              <Image src={post.mediaUrl} alt={post.caption} fill className="object-cover" />
            ) : post.embed ? (
              <EmbedPreview embed={post.embed} />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-ink/60">
                Media unavailable
              </div>
            )}
          </div>
          <div className="space-y-4 p-6">
            <h1 className="text-2xl font-display">{post.caption}</h1>
            <p className="text-xs text-ink/50">Post ID: {postId}</p>
            {post.embed?.author && (
              <p className="text-xs text-ink/60">Source attribution: {post.embed.author}</p>
            )}
            <div className="flex flex-wrap gap-2 text-xs">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-ink/10 px-3 py-1">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-6 text-sm text-ink/60">
              <span>{post.likeCount} likes</span>
              <span>{post.viewCount} views</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold">Comments</h2>
          <p className="mt-2 text-sm text-ink/60">Sign in to comment. Keep it civil.</p>
          <div className="mt-4 rounded-2xl border border-ink/10 bg-ink/5 p-4 text-sm text-ink/60">
            Comments are moderated. Anti-spam and rate limits apply.
          </div>
        </div>
      </div>
    </section>
  );
}
