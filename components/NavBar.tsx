import Link from 'next/link';
import { Logo } from './Logo';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/map', label: 'Map' },
  { href: '/observations', label: 'Observations' },
  { href: '/programs', label: 'Programs' },
];

export function NavBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/70 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Logo />
          <span className="text-lg">TideTag</span>
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <Link
          href="/observations/new"
          className="rounded-lg bg-tide-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-tide-700"
        >
          Submit
        </Link>
      </nav>
    </header>
  );
}
