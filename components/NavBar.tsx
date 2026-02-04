import Link from "next/link";

const navItems = [
  { href: "/feed", label: "Feed" },
  { href: "/explore", label: "Explore" },
  { href: "/submit", label: "Submit" },
  { href: "/me/submissions", label: "My Submissions" },
  { href: "/admin", label: "Admin" }
];

export function NavBar() {
  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur border-b border-ink/10">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="text-xl font-display tracking-tight">
          modih.in
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-ink/70 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-ink">
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="rounded-full border border-ink/20 px-3 py-1 text-sm hover:border-ink/40"
          >
            Login
          </Link>
        </nav>
        <Link
          href="/submit"
          className="md:hidden rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper"
        >
          Submit
        </Link>
      </div>
    </header>
  );
}
