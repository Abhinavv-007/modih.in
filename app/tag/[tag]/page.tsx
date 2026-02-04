import { FeedCard } from "@/components/FeedCard";
import { samplePosts } from "@/lib/sample-data";

export default function TagPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag);
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display">#{tag}</h2>
          <p className="text-sm text-ink/60">Approved posts tagged with #{tag}.</p>
        </div>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {samplePosts.map((post) => (
          <FeedCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
