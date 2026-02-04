import { AccountSettings } from "@/components/AccountSettings";

const submissions = [
  { id: "sub-1", caption: "Budget remix", status: "PENDING" },
  { id: "sub-2", caption: "Debate GIF", status: "APPROVED" },
  { id: "sub-3", caption: "Press clip", status: "REJECTED" }
];

export default function MySubmissionsPage() {
  return (
    <section className="mx-auto w-full max-w-4xl px-5 py-8">
      <div>
        <h2 className="text-2xl font-display">My submissions</h2>
        <p className="text-sm text-ink/60">Track your moderation status.</p>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div key={submission.id} className="rounded-2xl border border-ink/10 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold">{submission.caption}</h3>
                  <p className="text-xs text-ink/60">Under review — can take up to ~6 hours.</p>
                </div>
                <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold text-ink/70">
                  {submission.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        <AccountSettings />
      </div>
    </section>
  );
}
