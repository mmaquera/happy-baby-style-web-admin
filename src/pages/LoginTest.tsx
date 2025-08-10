import React from 'react';

const LoginTest: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#f0f0f0'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <h1>🔍 Login Test</h1>
        <p>Si ves esto, React está funcionando</p>
        <form>
          <div style={{ marginBottom: '1rem' }}>
            <input 
              type="email" 
              placeholder="Email"
              style={{ padding: '0.5rem', width: '200px' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <input 
              type="password" 
              placeholder="Password"
              style={{ padding: '0.5rem', width: '200px' }}
            />
          </div>
          <button 
            type="submit"
            style={{ 
              padding: '0.5rem 1rem', 
              background: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px' 
            }}
          >
            Login Test
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginTest;