import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/GlobalStyles.ts'
import './utils/authUtils.ts' // Import auth utilities for debugging

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)