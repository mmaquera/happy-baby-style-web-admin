import styled, { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Quicksand:wght@300;400;500;600&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  #root {
    overflow-x: hidden !important;
    width: 100%;
    max-width: 100vw;
    position: relative;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
    overflow-x: hidden !important;
    max-width: 100vw;
  }

  body {
    font-family: ${theme.fonts.primary};
    font-weight: ${theme.fontWeights.light};
    line-height: 1.6;
    color: ${theme.colors.text.primary};
    background: ${theme.colors.background.light};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden !important;
    max-width: 100vw;
    position: relative;
  }

  /* Forzar que ningún elemento cause scroll horizontal */
  * {
    max-width: 100%;
  }

  /* Específicamente para elementos que podrían causar overflow */
  div, span, p, h1, h2, h3, h4, h5, h6, section, article, aside, nav {
    overflow-wrap: break-word;
    word-wrap: break-word;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.heading};
    font-weight: ${theme.fontWeights.light};
    line-height: 1.2;
    margin-bottom: ${theme.spacing[4]};
  }

  h1 {
    font-size: ${theme.fontSizes['4xl']};
  }

  h2 {
    font-size: ${theme.fontSizes['3xl']};
  }

  h3 {
    font-size: ${theme.fontSizes['2xl']};
  }

  h4 {
    font-size: ${theme.fontSizes.xl};
  }

  h5 {
    font-size: ${theme.fontSizes.lg};
  }

  h6 {
    font-size: ${theme.fontSizes.base};
  }

  p {
    margin-bottom: ${theme.spacing[4]};
    line-height: 1.7;
  }

  a {
    color: ${theme.colors.primaryPurple};
    text-decoration: none;
    transition: color ${theme.transitions.base};

    &:hover {
      color: ${theme.colors.coralAccent};
    }
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    transition: all ${theme.transitions.base};

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  input, textarea, select {
    font-family: inherit;
    outline: none;
    transition: all ${theme.transitions.base};
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* Scrollbar styles */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.lightGray};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.warmGray};
    border-radius: ${theme.borderRadius.full};

    &:hover {
      background: ${theme.colors.primaryPurple};
    }
  }

  /* Selection styles */
  ::selection {
    background: ${theme.colors.softPurple};
    color: ${theme.colors.primaryPurple};
  }

  /* Focus styles */
  :focus-visible {
    outline: 2px solid ${theme.colors.primaryPurple};
    outline-offset: 2px;
  }

  /* Loading animation */
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .fade-in {
    animation: fadeIn 0.3s ease-out;
  }

  .slide-in {
    animation: slideIn 0.3s ease-out;
  }

  /* Responsive utilities */
  .mobile-only {
    @media (min-width: ${theme.breakpoints.md}) {
      display: none !important;
    }
  }

  .desktop-only {
    @media (max-width: ${theme.breakpoints.md}) {
      display: none !important;
    }
  }

  /* Accessibility */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Toast notifications styles */
  .Toastify__toast {
    font-family: ${theme.fonts.primary};
    border-radius: ${theme.borderRadius.lg};
  }

  .Toastify__toast--success {
    background: ${theme.colors.turquoise};
  }

  .Toastify__toast--error {
    background: ${theme.colors.coralAccent};
  }

  .Toastify__toast--info {
    background: ${theme.colors.primaryPurple};
  }
`;