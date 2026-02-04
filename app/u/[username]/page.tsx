import Image from "next/image";
import { samplePosts } from "@/lib/sample-data";

export default function ProfilePage({ params }: { params: { username: string } }) {
  const username = decodeURIComponent(params.username);
  return (
    <section className="mx-auto w-full max-w-5xl px-5 py-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="h-24 w-24 overflow-hidden rounded-3xl border border-ink/10 bg-ink/5">
          <Image src="/modi.png" alt="Avatar" width={96} height={96} className="object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-display">@{username}</h1>
          <p className="text-sm text-ink/60">Approved posts by this creator.</p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {samplePosts.map((post) => (
          <div key={post.id} className="rounded-3xl border border-ink/10 bg-white p-4 shadow-soft">
            <h3 className="text-sm font-semibold">{post.caption}</h3>
            <p className="mt-2 text-xs text-ink/60">{post.likeCount} likes</p>
          </div>
        ))}
      </div>
    </section>
  );
}
