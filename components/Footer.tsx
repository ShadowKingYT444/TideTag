import Link from 'next/link';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200/60 bg-white/50 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between lg:px-8">
        <div className="max-w-sm">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <Logo />
            <span className="text-base text-slate-900">TideTag</span>
          </Link>
          <p className="mt-3 text-sm text-slate-500">
            Citizen science for healthier coasts. Built for students, stewards,
            and scientists.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm sm:grid-cols-3">
          <FooterCol heading="Platform">
            <FooterLink href="/dashboard">Dashboard</FooterLink>
            <FooterLink href="/map">Map</FooterLink>
            <FooterLink href="/observations">Observations</FooterLink>
          </FooterCol>
          <FooterCol heading="Tools">
            <FooterLink href="/analyze">Analyzer</FooterLink>
            <FooterLink href="/observations/new">Submit</FooterLink>
            <FooterLink href="/programs">Programs</FooterLink>
          </FooterCol>
          <FooterCol heading="Data">
            <FooterLink href="/api/observations">/api/observations</FooterLink>
            <FooterLink href="/api/stats">/api/stats</FooterLink>
            <FooterLink href="/api/tides">/api/tides</FooterLink>
          </FooterCol>
        </div>
      </div>
      <div className="border-t border-slate-200/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} TideTag</p>
          <p className="text-slate-400">
            Tide data courtesy of{' '}
            <a
              href="https://tidesandcurrents.noaa.gov/"
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-slate-600"
            >
              NOAA CO-OPS
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {heading}
      </div>
      <ul className="space-y-1.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-slate-600 transition hover:text-slate-900">
        {children}
      </Link>
    </li>
  );
}
