import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PublicLayout } from '../components/layout/PublicLayout';
import { AccessDenied } from '../components/shared/AccessDenied';
import { SignInPage } from '../pages/auth/SignInPage';
import { SignUpPage } from '../pages/auth/SignUpPage';
import { BuyersPage } from '../pages/dashboard/BuyersPage';
import { CategoriesPage } from '../pages/dashboard/CategoriesPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { DealCreatePage } from '../pages/dashboard/DealCreatePage';
import { DealsPage } from '../pages/dashboard/DealsPage';
import { DiscountRulesPage } from '../pages/dashboard/DiscountRulesPage';
import { PaymentsPage } from '../pages/dashboard/PaymentsPage';
import { ProductsPage } from '../pages/dashboard/ProductsPage';
import { ProfilePage } from '../pages/dashboard/ProfilePage';
import { ReportsPage } from '../pages/dashboard/ReportsPage';
import { StockMovementsPage } from '../pages/dashboard/StockMovementsPage';
import { AboutPage } from '../pages/public/AboutPage';
import { ContactPage } from '../pages/public/ContactPage';
import { HomePage } from '../pages/public/HomePage';
import { getDefaultDashboardPath, hasDashboardRouteAccess, hasMutationPermission } from '../lib/permissions';
import { applyTheme, getPreferredTheme } from '../lib/theme';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { Profile, ThemeMode, UserRole } from '../lib/types';
import { normalizeErrorMessage } from '../lib/utils';

interface PublicShellProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
}

function PublicShell({ theme, onToggleTheme }: PublicShellProps) {
  return (
    <PublicLayout theme={theme} onToggleTheme={onToggleTheme}>
      <Outlet />
    </PublicLayout>
  );
}

interface DashboardShellProps {
  session: Session | null;
  profile: Profile | null;
  role: UserRole | null;
  email: string;
  theme: ThemeMode;
  onLogout: () => void;
  onToggleTheme: () => void;
}

function DashboardShell({
  session,
  profile,
  role,
  email,
  theme,
  onLogout,
  onToggleTheme,
}: DashboardShellProps) {
  if (!session) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <DashboardLayout
      profile={profile}
      role={role}
      email={email}
      theme={theme}
      onLogout={onLogout}
      onToggleTheme={onToggleTheme}
    >
      <Outlet />
    </DashboardLayout>
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [appError, setAppError] = useState('');
  const [theme, setTheme] = useState<ThemeMode>(() => getPreferredTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAppError('Додайте `VITE_SUPABASE_URL` та `VITE_SUPABASE_ANON_KEY` у файл `.env`.');
      setIsLoading(false);
      return;
    }

    const initialize = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setAppError(normalizeErrorMessage(error));
      } else {
        setSession(data.session);
      }

      setIsLoading(false);
    };

    void initialize();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setProfile(null);
      setIsProfileLoading(false);
      return;
    }

    setIsProfileLoading(true);
    const loadProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        setAppError(normalizeErrorMessage(error));
        setIsProfileLoading(false);
        return;
      }

      setProfile(data as Profile);
      setIsProfileLoading(false);
    };

    void loadProfile();
  }, [session]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (session && isProfileLoading) {
      return;
    }

    if (!session && location.pathname.startsWith('/dashboard')) {
      navigate('/signin', { replace: true });
      return;
    }

    if (session && (location.pathname === '/signin' || location.pathname === '/signup')) {
      navigate(getDefaultDashboardPath(profile?.role), { replace: true });
    }
  }, [isLoading, isProfileLoading, location.pathname, navigate, profile?.role, session]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setAppError(normalizeErrorMessage(error));
      return;
    }

    setSession(null);
    setProfile(null);
    navigate('/signin', { replace: true });
  };

  const handleAuthenticated = () => {
    setAppError('');
  };

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-300">
        Завантаження...
      </div>
    );
  }

  if (session && isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-300">
        Завантаження профілю...
      </div>
    );
  }

  const role = profile?.role ?? null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {appError ? (
        <div className="border-b border-red-200 bg-red-50 px-6 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/60 dark:text-red-200">
          {appError}
        </div>
      ) : null}

      <Routes>
        <Route element={<PublicShell theme={theme} onToggleTheme={toggleTheme} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contacts" element={<ContactPage />} />
        </Route>

        <Route
          path="/signin"
          element={
            <SignInPage
              onLogin={handleAuthenticated}
              onNavigate={navigate}
              appError={appError}
              theme={theme}
              onToggleTheme={toggleTheme}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <SignUpPage
              onSignUp={handleAuthenticated}
              onNavigate={navigate}
              appError={appError}
              theme={theme}
              onToggleTheme={toggleTheme}
            />
          }
        />

        <Route
          path="/dashboard"
          element={
            <DashboardShell
              session={session}
              profile={profile}
              role={role}
              email={session?.user.email ?? ''}
              theme={theme}
              onLogout={handleLogout}
              onToggleTheme={toggleTheme}
            />
          }
        >
          <Route
            index
            element={
              hasDashboardRouteAccess(role, 'dashboard') ? (
                <DashboardPage />
              ) : (
                <AccessDenied />
              )
            }
          />
          <Route
            path="products"
            element={
              hasDashboardRouteAccess(role, 'products') ? (
                <ProductsPage canManage={hasMutationPermission(role, 'manageProducts')} />
              ) : (
                <AccessDenied />
              )
            }
          />
          <Route
            path="categories"
            element={
              hasDashboardRouteAccess(role, 'categories') ? (
                <CategoriesPage canManage={hasMutationPermission(role, 'manageCategories')} />
              ) : (
                <AccessDenied />
              )
            }
          />
          <Route
            path="buyers"
            element={
              hasDashboardRouteAccess(role, 'buyers') ? (
                <BuyersPage canManage={hasMutationPermission(role, 'manageBuyers')} />
              ) : (
                <AccessDenied />
              )
            }
          />
          <Route
            path="deals"
            element={
              hasDashboardRouteAccess(role, 'deals') ? (
                <DealsPage onNavigate={navigate} canManage={hasMutationPermission(role, 'manageDeals')} />
              ) : (
                <AccessDenied />
              )
            }
          />
          <Route
            path="deals/new"
            element={
              hasMutationPermission(role, 'manageDeals') ? (
                <DealCreatePage onNavigate={navigate} />
              ) : (
                <AccessDenied description="Лише адміністратор і менеджер можуть створювати або змінювати угоди." />
              )
            }
          />
          <Route
            path="discounts"
            element={
              hasDashboardRouteAccess(role, 'discounts') ? (
                <DiscountRulesPage canManage={hasMutationPermission(role, 'manageDiscountRules')} />
              ) : (
                <AccessDenied />
              )
            }
          />
          <Route
            path="payments"
            element={
              hasDashboardRouteAccess(role, 'payments') ? (
                <PaymentsPage canManage={hasMutationPermission(role, 'managePayments')} />
              ) : (
                <AccessDenied />
              )
            }
          />
          <Route
            path="stock-movements"
            element={
              hasDashboardRouteAccess(role, 'stock-movements') ? (
                <StockMovementsPage canManage={hasMutationPermission(role, 'manageStockMovements')} />
              ) : (
                <AccessDenied />
              )
            }
          />
          <Route
            path="reports"
            element={hasDashboardRouteAccess(role, 'reports') ? <ReportsPage /> : <AccessDenied />}
          />
          <Route
            path="profile"
            element={
              hasDashboardRouteAccess(role, 'profile') ? (
                <ProfilePage session={session as Session} profile={profile} onProfileUpdated={setProfile} />
              ) : (
                <AccessDenied />
              )
            }
          />
        </Route>

        <Route path="*" element={<Navigate to={session ? '/dashboard' : '/'} replace />} />
      </Routes>
    </div>
  );
}
