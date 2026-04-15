export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200/70 bg-white/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} TideTag — citizen science for healthier coasts.</p>
        <p className="text-slate-400">
          Built for students, stewards, and scientists.
        </p>
      </div>
    </footer>
  );
}
