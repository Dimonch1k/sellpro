import { ShieldAlert } from 'lucide-react';

interface AccessDeniedProps {
  title?: string;
  description?: string;
}

export function AccessDenied({
  title = 'Доступ обмежено',
  description = 'У вашої ролі немає доступу до цієї сторінки або дії.',
}: AccessDeniedProps) {
  return (
    <div className="app-panel mx-auto max-w-2xl p-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <h1 className="mb-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
      <p className="text-slate-600 dark:text-slate-300">{description}</p>
    </div>
  );
}
