import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from 'styled-components';
import { Toaster } from 'react-hot-toast';
import { GlobalStyles } from '@/styles/GlobalStyles';
import { theme } from '@/styles/theme';
import { Layout } from '@/components/layout/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { Products } from '@/pages/Products';
import { Orders } from '@/pages/Orders';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/customers" element={<ComingSoon page="Clientes" />} />
              <Route path="/images" element={<ComingSoon page="Imágenes" />} />
              <Route path="/analytics" element={<ComingSoon page="Estadísticas" />} />
              <Route path="/settings" element={<ComingSoon page="Configuración" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
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
      </ThemeProvider>
    </QueryClientProvider>
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