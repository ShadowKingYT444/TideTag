import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-24 text-center">
      <div className="glass flex h-16 w-16 items-center justify-center rounded-2xl text-3xl">
        🌊
      </div>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-slate-900">
        Page not found
      </h1>
      <p className="mt-2 text-slate-600">
        The tide must have washed this one away.
      </p>
      <Link href="/" className="btn-primary mt-6">
        Back to shore
      </Link>
    </div>
  );
}
