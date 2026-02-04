import Link from "next/link";
import { AuthLogin } from "@/components/AuthLogin";

export default function LoginPage() {
  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-6 px-5 py-12">
      <div>
        <h2 className="text-2xl font-display">Welcome back</h2>
        <p className="text-sm text-ink/60">Sign in to like, comment, and submit.</p>
      </div>
      <AuthLogin />
      <p className="text-xs text-ink/60">
        New here? <Link href="/signup" className="text-accent">Create account</Link>.
      </p>
    </section>
  );
}
