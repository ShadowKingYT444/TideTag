import type { Severity } from '@/lib/types';

const styles: Record<Severity, string> = {
  info: 'bg-tide-50 text-tide-800 ring-1 ring-inset ring-tide-200/80',
  watch: 'bg-amber-50 text-amber-900 ring-1 ring-inset ring-amber-200/80',
  alert: 'bg-red-50 text-red-900 ring-1 ring-inset ring-red-200/80',
};

const dot: Record<Severity, string> = {
  info: 'bg-tide-500 shadow-[0_0_0_3px_rgba(45,144,255,0.15)]',
  watch: 'bg-amber-500 shadow-[0_0_0_3px_rgba(245,158,11,0.18)]',
  alert: 'bg-red-600 shadow-[0_0_0_3px_rgba(220,38,38,0.18)]',
};

const label: Record<Severity, string> = {
  info: 'Info',
  watch: 'Watch',
  alert: 'Alert',
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={`pill ${styles[severity]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot[severity]}`} />
      {label[severity]}
    </span>
  );
}
