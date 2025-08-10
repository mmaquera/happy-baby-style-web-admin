import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Toaster } from 'react-hot-toast';
import { ApolloProvider } from '@apollo/client';
import { client } from './services/graphql';
import { GlobalStyles } from '@/styles/GlobalStyles';
import { theme } from '@/styles/theme';
import { AuthProvider } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Login } from '@/pages/Login';
import { Unauthorized } from '@/pages/Unauthorized';
import { Dashboard } from '@/pages/Dashboard';
import { Products } from '@/pages/Products';
import { Orders } from '@/pages/Orders';
import UsersPage from '@/pages/Users';

function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/products" element={
                <ProtectedRoute>
                  <Layout>
                    <Products />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <Layout>
                    <Orders />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/users" element={
                <ProtectedRoute>
                  <Layout>
                    <UsersPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/images" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon page="Imágenes" />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon page="Estadísticas" />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon page="Configuración" />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="*" element={
                <ProtectedRoute>
                  <Layout>
                    <NotFound />
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
          <Toaster
            position="top-right"
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
      </ThemeProvider>
    </ApolloProvider>
  );
}

// Temporary components for routes not implemented yet
const ComingSoon: React.FC<{ page: string }> = ({ page }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem',
    textAlign: 'center',
    color: theme.colors.text.secondary,
  }}>
    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚧</div>
    <h2 style={{ 
      fontFamily: theme.fonts.heading, 
      fontSize: theme.fontSizes['3xl'],
      fontWeight: theme.fontWeights.light,
      color: theme.colors.text.primary,
      marginBottom: '0.5rem'
    }}>
      {page}
    </h2>
    <p style={{ fontSize: theme.fontSizes.lg }}>
      Esta página está en construcción
    </p>
  </div>
);

const NotFound: React.FC = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem',
    textAlign: 'center',
    color: theme.colors.text.secondary,
  }}>
    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🤔</div>
    <h2 style={{ 
      fontFamily: theme.fonts.heading, 
      fontSize: theme.fontSizes['3xl'],
      fontWeight: theme.fontWeights.light,
      color: theme.colors.text.primary,
      marginBottom: '0.5rem'
    }}>
      Página no encontrada
    </h2>
    <p style={{ fontSize: theme.fontSizes.lg }}>
      La página que buscas no existe
    </p>
  </div>
);

export default App;