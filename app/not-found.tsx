import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <div className="text-5xl">🌊</div>
      <h1 className="mt-4 text-2xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-2 text-slate-600">
        The tide must have washed this one away.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-tide-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-tide-700"
      >
        Back to shore
      </Link>
    </div>
  );
}
