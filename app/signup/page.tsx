import Link from "next/link";
import { AuthSignup } from "@/components/AuthSignup";

export default function SignupPage() {
  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-6 px-5 py-12">
      <div>
        <h2 className="text-2xl font-display">Create account</h2>
        <p className="text-sm text-ink/60">Pick a username and join the parody feed.</p>
      </div>
      <AuthSignup />
      <p className="text-xs text-ink/60">
        Already have an account? <Link href="/login" className="text-accent">Sign in</Link>.
      </p>
    </section>
  );
}
