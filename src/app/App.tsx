import { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';

import { HomePage } from '../pages/public/HomePage';
import { SignInPage } from '../pages/auth/SignInPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { ProductsPage } from '../pages/dashboard/ProductsPage';
import { CategoriesPage } from '../pages/dashboard/CategoriesPage';
import { BuyersPage } from '../pages/dashboard/BuyersPage';
import { DealsPage } from '../pages/dashboard/DealsPage';
import { DealCreatePage } from '../pages/dashboard/DealCreatePage';
import { DiscountRulesPage } from '../pages/dashboard/DiscountRulesPage';
import { PaymentsPage } from '../pages/dashboard/PaymentsPage';
import { StockMovementsPage } from '../pages/dashboard/StockMovementsPage';
import { ReportsPage } from '../pages/dashboard/ReportsPage';
import { ProfilePage } from '../pages/dashboard/ProfilePage';

type Page =
  | 'home'
  | 'signin'
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'buyers'
  | 'deals'
  | 'deals-new'
  | 'discounts'
  | 'payments'
  | 'stock-movements'
  | 'reports'
  | 'profile';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    if (!isAuthenticated) {
      if (currentPage === 'home') {
        return <HomePage onNavigate={setCurrentPage} />;
      }
      return <SignInPage onLogin={handleLogin} />;
    }

    const pageContent = (() => {
      switch (currentPage) {
        case 'dashboard':
          return <DashboardPage />;
        case 'products':
          return <ProductsPage />;
        case 'categories':
          return <CategoriesPage />;
        case 'buyers':
          return <BuyersPage />;
        case 'deals':
          return <DealsPage />;
        case 'deals-new':
          return <DealCreatePage onNavigate={setCurrentPage} />;
        case 'discounts':
          return <DiscountRulesPage />;
        case 'payments':
          return <PaymentsPage />;
        case 'stock-movements':
          return <StockMovementsPage />;
        case 'reports':
          return <ReportsPage />;
        case 'profile':
          return <ProfilePage />;
        default:
          return <DashboardPage />;
      }
    })();

    return <DashboardLayout currentPage={currentPage} onNavigate={setCurrentPage}>{pageContent}</DashboardLayout>;
  };

  return renderPage();
}