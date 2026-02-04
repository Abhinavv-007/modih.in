import { SubmitForm } from "@/components/SubmitForm";

export default function SubmitPage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-5 py-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <SubmitForm />
        <aside className="space-y-4">
          <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft">
            <h3 className="text-lg font-semibold">Submission checklist</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink/70">
              <li>Parody only. No hate speech or harassment.</li>
              <li>No scraping or reuploads from social platforms.</li>
              <li>Embeds must be official (oEmbed or official share).</li>
              <li>Every post goes through moderation.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-ink/10 bg-ink p-6 text-paper">
            <h3 className="text-lg font-semibold">Moderation delay</h3>
            <p className="mt-2 text-sm text-paper/80">
              Under review — can take up to ~6 hours.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
