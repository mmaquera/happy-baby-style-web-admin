// Happy Baby Style Theme
export const theme = {
  colors: {
    white: '#FFFFFF',
    primaryPurple: '#A285D1',
    coralAccent: '#FF7B5A',
    turquoise: '#5CBDB4',
    warmGray: '#8B8680',
    darkGray: '#2C2C2C',
    lightGray: '#F8F8F8',
    softPurple: 'rgba(162, 133, 209, 0.1)',
    
    // Primary and secondary colors for compatibility
    primary: '#A285D1',
    secondary: '#5CBDB4',
    
    // Semantic colors
    success: '#5CBDB4',
    warning: '#FF7B5A',
    error: '#E53E3E',
    info: '#A285D1',
    
    // Text colors
    text: {
      primary: '#2C2C2C',
      secondary: '#8B8680',
      white: '#FFFFFF',
      accent: '#A285D1'
    },
    
    // Background colors
    background: {
      primary: '#FFFFFF',
      secondary: '#F8F8F8',
      accent: 'rgba(162, 133, 209, 0.1)',
      hover: 'rgba(162, 133, 209, 0.05)',
      light: '#F8F8F8'
    },
    
    // Border colors
    border: {
      light: 'rgba(139, 134, 128, 0.1)',
      medium: 'rgba(139, 134, 128, 0.3)',
      accent: '#A285D1'
    }
  },
  
  fonts: {
    primary: "'Quicksand', sans-serif",
    heading: "'Montserrat', sans-serif"
  },
  
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  
  fontSizes: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem',     // 128px
  },
  
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    base: '0.5rem',  // 8px
    md: '0.75rem',   // 12px
    lg: '1rem',      // 16px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    card: '0 10px 30px rgba(0, 0, 0, 0.1)',
    accent: '0 10px 30px rgba(255, 123, 90, 0.3)',
  },
  
  transitions: {
    fast: '0.2s ease',
    base: '0.3s ease',
    slow: '0.5s ease',
  },
  
  breakpoints: {
    sm: '480px',
    md: '768px',
    lg: '1024px',
    xl: '1200px',
  },
  
  zIndex: {
    modal: 1000,
    dropdown: 100,
    header: 50,
    overlay: 40,
    above: 10,
    base: 1,
    below: -1,
  }
};

// Helper function to create responsive styles
export const responsive = {
  mobile: (styles: string) => `
    @media (max-width: ${theme.breakpoints.md}) {
      ${styles}
    }
  `,
  tablet: (styles: string) => `
    @media (min-width: ${theme.breakpoints.md}) and (max-width: ${theme.breakpoints.lg}) {
      ${styles}
    }
  `,
  desktop: (styles: string) => `
    @media (min-width: ${theme.breakpoints.lg}) {
      ${styles}
    }
  `,
};