import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { ThemeMode } from '../../lib/types';
import { normalizeErrorMessage } from '../../lib/utils';
import { ThemeToggle } from '../../components/shared/ThemeToggle';

interface SignInPageProps {
  onLogin: () => void;
  onNavigate: (path: string, options?: { replace?: boolean }) => void;
  appError?: string;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export function SignInPage({ onLogin, onNavigate, appError, theme, onToggleTheme }: SignInPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Заповніть email і пароль.');
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(normalizeErrorMessage(error));
      return;
    }

    onLogin();
    onNavigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
      <div className="max-w-md w-full">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Вхід до системи</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Введіть свої дані для доступу</p>
          </div>

          {appError ? (
            <div className="app-alert-error mb-4">
              {appError}
            </div>
          ) : null}

          {errorMessage ? (
            <div className="app-alert-error mb-4">
              {errorMessage}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Електронна пошта
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white py-2 pr-4 pl-10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white py-2 pr-4 pl-10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700" />
                <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">Запам'ятати мене</span>
              </label>
              <button type="button" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                Забули пароль?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
            >
              {isSubmitting ? 'Вхід...' : 'Увійти'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Ще не маєте облікового запису?{' '}
            <button
              type="button"
              onClick={() => onNavigate('/signup')}
              className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Зареєструватися
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
