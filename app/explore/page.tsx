import Image from "next/image";
import Link from "next/link";
import { samplePosts } from "@/lib/sample-data";

export default function ExplorePage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display">Explore grid</h2>
          <p className="text-sm text-ink/60">Quick scan by tags or format.</p>
        </div>
        <Link href="/submit" className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper">
          Upload
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-3xl border border-ink/10 bg-white p-4 shadow-soft md:flex-row md:items-center">
        <input
          type="text"
          placeholder="Search tags, captions, usernames"
          className="flex-1 rounded-2xl border border-ink/10 px-4 py-2 text-sm"
        />
        <button className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-paper">Search</button>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {samplePosts.map((post) => (
          <Link
            key={post.id}
            href={`/post/${post.id}`}
            className="group overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-soft"
          >
            <div className="relative aspect-[4/5] bg-ink/5">
              {post.mediaUrl ? (
                <Image src={post.mediaUrl} alt={post.caption} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-ink/50">
                  Embed preview
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-ink group-hover:text-accent">{post.caption}</h3>
              <p className="mt-2 text-xs text-ink/60">{post.likeCount} likes</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
