import type { Severity } from '@/lib/types';

const styles: Record<Severity, string> = {
  info: 'bg-tide-100 text-tide-800 ring-1 ring-inset ring-tide-200',
  watch: 'bg-amber-100 text-amber-900 ring-1 ring-inset ring-amber-200',
  alert: 'bg-red-100 text-red-900 ring-1 ring-inset ring-red-200',
};

const dot: Record<Severity, string> = {
  info: 'bg-tide-500',
  watch: 'bg-amber-500',
  alert: 'bg-red-600',
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={`pill ${styles[severity]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot[severity]}`} />
      {severity}
    </span>
  );
}
