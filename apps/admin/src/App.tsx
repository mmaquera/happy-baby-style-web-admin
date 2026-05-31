import type React from 'react';
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@happy-baby/shared-ui';
import { TooltipProvider } from '@happy-baby/shared-ui';
import { Toaster } from 'react-hot-toast';
import { ApolloProvider } from '@apollo/client';
import { client } from './infrastructure/graphql/apollo/apolloClient';
import { AuthProvider } from '@happy-baby/feature-auth';
import { ProductProvider } from '@/app/di/products';
import { CategoryProvider } from '@/app/di/categories';
import { UserProvider } from '@/app/di/users';
import { OrderProvider } from '@/app/di/orders';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@happy-baby/feature-auth';
import { Login } from '@/pages/Login';
import { Unauthorized } from '@/pages/Unauthorized';

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
        <TooltipProvider>
          <ProductProvider>
            <CategoryProvider>
              <OrderProvider>
                <UserProvider>
                  <AuthProvider>
                    <Router>
                      <Suspense fallback={<PageLoader />}>
                        <Routes>
                          <Route path='/login' element={<Login />} />
                          <Route
                            path='/unauthorized'
                            element={<Unauthorized />}
                          />

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
                    <Toaster
                      position='top-right'
                      toastOptions={{
                        duration: 4000,
                        style: {
                          background: '#ffffff',
                          color: '#2C2C2C',
                          borderRadius: '12px',
                          border: '1px solid #f3f4f6',
                          fontFamily: "'Quicksand', sans-serif",
                        },
                        success: {
                          iconTheme: {
                            primary: '#5CBDB4',
                            secondary: '#ffffff',
                          },
                        },
                        error: {
                          iconTheme: {
                            primary: '#FF7B5A',
                            secondary: '#ffffff',
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
      </ApolloProvider>
    </ErrorBoundary>
  );
}

const PageLoader: React.FC = () => (
  <div className='flex h-screen items-center justify-center bg-background'>
    <div className='h-8 w-8 animate-spin rounded-full border-[3px] border-border border-t-brand-purple' />
  </div>
);

const ComingSoon: React.FC<{ page: string }> = ({ page }) => (
  <div className='flex flex-col items-center justify-center p-16 text-center text-muted-foreground'>
    <div className='mb-4 text-6xl'>🚧</div>
    <h2 className='mb-2 font-heading text-3xl font-light text-foreground'>
      {page}
    </h2>
    <p className='text-lg'>Esta página está en construcción</p>
  </div>
);

const NotFound: React.FC = () => (
  <div className='flex flex-col items-center justify-center p-16 text-center text-muted-foreground'>
    <div className='mb-4 text-6xl'>🤔</div>
    <h2 className='mb-2 font-heading text-3xl font-light text-foreground'>
      Página no encontrada
    </h2>
    <p className='text-lg'>La página que buscas no existe</p>
  </div>
);

export default App;
