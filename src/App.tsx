import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './features/auth/context/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { ToastContainer } from './components/common/ToastContainer';
import { useToast } from './hooks/useToast';
import { LandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { CalculadoraPage } from './pages/calculadora/CalculadoraPage';
import { HistoricoPage } from './pages/historico/HistoricoPage';
import { SubscriptionsPage } from './pages/subscriptions/SubscriptionsPage';
import { UsersPage } from './pages/users/UsersPage';
import { FerramentasPage } from './pages/ferramentas/FerramentasPage';
import { CadastrosPage } from './pages/cadastros/CadastrosPage';
import { BaseSimulacaoPage } from './pages/base-simulacao/BaseSimulacaoPage';
import { AnalisesPage } from './pages/analises/AnalisesPage';
import { NovaAnalisePage } from './pages/analises/NovaAnalisePage';
import { ROUTES } from './utils/constants';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const { toasts, removeToast } = useToast();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <ToastContainer toasts={toasts} onRemove={removeToast} />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
              <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.CALCULADORA}
              element={
                <ProtectedRoute>
                  <CalculadoraPage />
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.HISTORICO}
              element={
                <ProtectedRoute>
                  <HistoricoPage />
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.SUBSCRIPTIONS}
              element={
                <ProtectedRoute adminOnly>
                  <SubscriptionsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.USERS}
              element={
                <ProtectedRoute adminOnly>
                  <UsersPage />
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.FERRAMENTAS}
              element={
                <ProtectedRoute>
                  <FerramentasPage />
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.CADASTROS}
              element={
                <ProtectedRoute>
                  <CadastrosPage />
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.BASE_SIMULACAO}
              element={
                <ProtectedRoute>
                  <BaseSimulacaoPage />
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.ANALISES}
              element={
                <ProtectedRoute>
                  <AnalisesPage />
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.ANALISES_NOVA}
              element={
                <ProtectedRoute>
                  <NovaAnalisePage />
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.ANALISES_EDITAR}
              element={
                <ProtectedRoute>
                  <NovaAnalisePage />
                </ProtectedRoute>
              }
            />

            {/* 404 - Redirect to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
