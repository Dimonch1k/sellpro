import { useState } from 'react';
import { User, Phone, Mail, Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { ThemeMode } from '../../lib/types';
import { normalizeErrorMessage } from '../../lib/utils';
import { ThemeToggle } from '../../components/shared/ThemeToggle';

interface SignUpPageProps {
  onSignUp: () => void;
  onNavigate: (path: string, options?: { replace?: boolean }) => void;
  appError?: string;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export function SignUpPage({ onSignUp, onNavigate, appError, theme, onToggleTheme }: SignUpPageProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.fullName.trim()) {
      setErrorMessage('Вкажіть повне імʼя.');
      return;
    }

    if (!formData.phone.trim()) {
      setErrorMessage('Вкажіть номер телефону.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Пароль має містити щонайменше 6 символів.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Паролі не збігаються.');
      return;
    }

    setIsSubmitting(true);
    const { data, error } = await supabase.auth.signUp({
      email: formData.email.trim(),
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName.trim(),
          phone: formData.phone.trim(),
        },
      },
    });
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(normalizeErrorMessage(error));
      return;
    }

    if (data.session) {
      onSignUp();
      onNavigate('/dashboard', { replace: true });
      return;
    }

    setSuccessMessage('Обліковий запис створено. Якщо ввімкнено підтвердження email, перевірте пошту та увійдіть після підтвердження.');
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
      <div className="max-w-md w-full">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Реєстрація</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Створіть свій обліковий запис</p>
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

          {successMessage ? (
            <div className="app-alert-success mb-4">
              {successMessage}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Повне ім'я
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white py-2 pr-4 pl-10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  placeholder="Іван Петренко"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Телефон
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white py-2 pr-4 pl-10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  placeholder="+380 XX XXX XX XX"
                />
              </div>
            </div>

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
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
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
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white py-2 pr-4 pl-10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Підтвердження паролю
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white py-2 pr-4 pl-10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium mt-6"
            >
              {isSubmitting ? 'Створення...' : 'Зареєструватися'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Вже маєте обліковий запис?{' '}
            <button
              type="button"
              onClick={() => onNavigate('/signin')}
              className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Увійти
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
