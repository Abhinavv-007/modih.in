import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 md:flex-row md:items-center">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">Satire, responsibly</p>
          <h1 className="mt-4 text-4xl font-display leading-tight md:text-5xl">
            Political parody, clean UI, and zero scraping.
          </h1>
          <p className="mt-4 text-base text-ink/70">
            modih.in is a fast, mobile-first meme platform for political satire. Every post is moderated before
            it goes public.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/feed"
              className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper"
            >
              Enter Feed
            </Link>
            <Link
              href="/submit"
              className="rounded-full border border-ink/20 px-6 py-3 text-sm font-semibold"
            >
              Submit Meme
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-4 text-xs text-ink/60">
            <span>Moderation delay: Under review — can take up to ~6 hours.</span>
            <span>Embeds via official oEmbed only.</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] border border-ink/10 bg-white shadow-glow">
            <Image
              src="/preview-image.png"
              alt="App preview"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-paper/90 p-4 text-sm text-ink/70">
              New satire drops every hour. Scroll the reel feed or explore by tags.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
