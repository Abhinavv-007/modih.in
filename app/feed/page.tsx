import { FeedCard } from "@/components/FeedCard";
import { samplePosts } from "@/lib/sample-data";

export default function FeedPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-display">Fresh satire feed</h2>
        <p className="text-sm text-ink/60">
          Only approved posts are visible. Under review — can take up to ~6 hours.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-6 md:grid md:grid-cols-2 md:items-start">
        <div className="reel-scroll flex h-[88vh] flex-col gap-6 overflow-y-auto pr-2">
          {samplePosts.map((post) => (
            <FeedCard key={post.id} post={post} />
          ))}
        </div>
        <div className="hidden flex-col gap-4 md:flex">
          <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft">
            <h3 className="text-lg font-semibold">Filter</h3>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <button className="rounded-full border border-ink/20 px-3 py-2">New</button>
              <button className="rounded-full border border-ink/20 px-3 py-2">Trending</button>
              <button className="rounded-full border border-ink/20 px-3 py-2">Most Liked</button>
              <button className="rounded-full border border-ink/20 px-3 py-2">Most Viewed</button>
            </div>
            <div className="mt-6">
              <h4 className="text-sm font-semibold">Content type</h4>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {[
                  "Image",
                  "Video",
                  "GIF",
                  "Music",
                  "Embed"
                ].map((item) => (
                  <span key={item} className="rounded-full border border-ink/10 px-3 py-1">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-ink/10 bg-ink p-6 text-paper">
            <h3 className="text-lg font-semibold">Report abuse fast</h3>
            <p className="mt-2 text-sm text-paper/80">
              Use the report button on every post. Admins review and respond quickly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
