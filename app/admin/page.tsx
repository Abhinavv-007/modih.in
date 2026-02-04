const pendingPosts = [
  { id: "p-1", caption: "Budget remix", user: "@satirelab" },
  { id: "p-2", caption: "Press meme", user: "@policyparody" }
];

const reports = [
  { id: "r-1", post: "p-2", reason: "Harassment" }
];

export default function AdminPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-8">
      <div>
        <h2 className="text-2xl font-display">Admin dashboard</h2>
        <p className="text-sm text-ink/60">Role protected. Moderation queue is private.</p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft">
            <h3 className="text-lg font-semibold">Moderation queue (PENDING)</h3>
            <div className="mt-4 space-y-3">
              {pendingPosts.map((post) => (
                <div key={post.id} className="rounded-2xl border border-ink/10 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{post.caption}</p>
                      <p className="text-xs text-ink/60">{post.user}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="rounded-full border border-ink/20 px-3 py-1 text-xs">Reject</button>
                      <button className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-paper">Approve</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft">
            <h3 className="text-lg font-semibold">Reports</h3>
            <div className="mt-4 space-y-3">
              {reports.map((report) => (
                <div key={report.id} className="rounded-2xl border border-ink/10 p-4 text-sm">
                  <p>Post: {report.post}</p>
                  <p className="text-xs text-ink/60">Reason: {report.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft">
            <h3 className="text-lg font-semibold">User search</h3>
            <input
              type="text"
              placeholder="Search username"
              className="mt-3 w-full rounded-2xl border border-ink/15 px-4 py-2"
            />
            <button className="mt-3 w-full rounded-full bg-ink px-3 py-2 text-sm font-semibold text-paper">
              Find user
            </button>
          </div>
          <div className="rounded-3xl border border-ink/10 bg-ink p-6 text-paper">
            <h3 className="text-lg font-semibold">Admin actions</h3>
            <ul className="mt-3 space-y-2 text-sm text-paper/80">
              <li>Approve or reject</li>
              <li>Edit caption, tags, type</li>
              <li>Ban user or clear report</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
