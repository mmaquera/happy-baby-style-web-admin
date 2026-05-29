import type React from 'react';
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { TooltipProvider } from '@/components/ui';
import { ThemeProvider } from 'styled-components';
import { Toaster } from 'react-hot-toast';
import { ApolloProvider } from '@apollo/client';
import { client } from './services/graphql';
import { GlobalStyles } from '@/styles/GlobalStyles';
import { theme } from '@/styles/theme';
import { AuthProvider } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { ProductProvider } from '@/app/di/products';
import { CategoryProvider } from '@/app/di/categories';
import { UserProvider } from '@/app/di/users';
import { OrderProvider } from '@/app/di/orders';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Login } from '@/pages/Login';
import { Unauthorized } from '@/pages/Unauthorized';

// Lazy-loaded protected pages — not included in the initial bundle
const Dashboard = lazy(() =>
  import('@/pages/Dashboard').then(m => ({ default: m.Dashboard }))
);
const Products = lazy(() =>
  import('@/pages/Products').then(m => ({ default: m.Products }))
);
const Categories = lazy(() =>
  import('@/pages/Categories').then(m => ({ default: m.Categories }))
);
const Orders = lazy(() =>
  import('@/pages/Orders').then(m => ({ default: m.Orders }))
);
const UsersPage = lazy(() => import('@/pages/Users'));

function App() {
  return (
    <ErrorBoundary>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <TooltipProvider>
            <ProductProvider>
              <CategoryProvider>
                <OrderProvider>
                  <UserProvider>
                    <AuthProvider>
                      <SidebarProvider>
                        <Router>
                          <Suspense fallback={<PageLoader />}>
                            <Routes>
                              {/* Public routes — kept eager */}
                              <Route path='/login' element={<Login />} />
                              <Route
                                path='/unauthorized'
                                element={<Unauthorized />}
                              />

                              {/* Protected routes — pages are lazy-loaded */}
                              <Route
                                path='/'
                                element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <Dashboard />
                                    </Layout>
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path='/products'
                                element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <Products />
                                    </Layout>
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path='/categories'
                                element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <Categories />
                                    </Layout>
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path='/orders'
                                element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <Orders />
                                    </Layout>
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path='/users'
                                element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <UsersPage />
                                    </Layout>
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path='/images'
                                element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <ComingSoon page='Imágenes' />
                                    </Layout>
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path='/analytics'
                                element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <ComingSoon page='Estadísticas' />
                                    </Layout>
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path='/settings'
                                element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <ComingSoon page='Configuración' />
                                    </Layout>
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path='*'
                                element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <NotFound />
                                    </Layout>
                                  </ProtectedRoute>
                                }
                              />
                            </Routes>
                          </Suspense>
                        </Router>
                      </SidebarProvider>
                      <Toaster
                        position='top-right'
                        toastOptions={{
                          duration: 4000,
                          style: {
                            background: theme.colors.white,
                            color: theme.colors.text.primary,
                            borderRadius: theme.borderRadius.lg,
                            border: `1px solid ${theme.colors.border.light}`,
                            fontFamily: theme.fonts.primary,
                          },
                          success: {
                            iconTheme: {
                              primary: theme.colors.success,
                              secondary: theme.colors.white,
                            },
                          },
                          error: {
                            iconTheme: {
                              primary: theme.colors.error,
                              secondary: theme.colors.white,
                            },
                          },
                        }}
                      />
                    </AuthProvider>
                  </UserProvider>
                </OrderProvider>
              </CategoryProvider>
            </ProductProvider>
          </TooltipProvider>
        </ThemeProvider>
      </ApolloProvider>
    </ErrorBoundary>
  );
}

const PageLoader: React.FC = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: theme.colors.background.primary,
    }}
  >
    <div
      style={{
        width: 32,
        height: 32,
        border: `3px solid ${theme.colors.border.light}`,
        borderTopColor: theme.colors.primary,
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }}
    />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const ComingSoon: React.FC<{ page: string }> = ({ page }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem',
      textAlign: 'center',
      color: theme.colors.text.secondary,
    }}
  >
    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚧</div>
    <h2
      style={{
        fontFamily: theme.fonts.heading,
        fontSize: theme.fontSizes['3xl'],
        fontWeight: theme.fontWeights.light,
        color: theme.colors.text.primary,
        marginBottom: '0.5rem',
      }}
    >
      {page}
    </h2>
    <p style={{ fontSize: theme.fontSizes.lg }}>
      Esta página está en construcción
    </p>
  </div>
);

const NotFound: React.FC = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem',
      textAlign: 'center',
      color: theme.colors.text.secondary,
    }}
  >
    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🤔</div>
    <h2
      style={{
        fontFamily: theme.fonts.heading,
        fontSize: theme.fontSizes['3xl'],
        fontWeight: theme.fontWeights.light,
        color: theme.colors.text.primary,
        marginBottom: '0.5rem',
      }}
    >
      Página no encontrada
    </h2>
    <p style={{ fontSize: theme.fontSizes.lg }}>
      La página que buscas no existe
    </p>
  </div>
);

export default App;
