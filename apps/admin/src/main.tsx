import React from 'react';
import ReactDOM from 'react-dom/client';
import { sentryAdapter } from '@happy-baby/infrastructure-monitoring';
import App from './App.tsx';
import './index.css';
import './utils/authUtils.ts'; // Cleans expired auth tokens on startup

sentryAdapter.init();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
