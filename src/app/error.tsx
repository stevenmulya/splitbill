'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error Boundary Caught:', error);
  }, [error]);

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
      backgroundColor: 'var(--bg-color)',
      color: 'var(--text-primary)'
    }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Something went wrong!</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px', lineHeight: 1.5 }}>
        We apologize for the inconvenience. An unexpected system error has occurred.
      </p>
      
      <div style={{ 
        padding: '1.25rem', 
        background: 'var(--surface-color)', 
        border: '1px solid var(--border-color)', 
        borderRadius: '16px', 
        marginBottom: '2rem', 
        maxWidth: '500px', 
        width: '100%',
        wordBreak: 'break-word', 
        textAlign: 'left', 
        color: '#ef4444', 
        fontSize: '0.95rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        position: 'relative'
      }}>
        <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Error Details:</strong> 
        {error.message || 'Unknown Application Error'}
        
        <button 
          onClick={() => {
            navigator.clipboard.writeText(error.message || 'Unknown Application Error');
            alert('Error message copied to clipboard!');
          }}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'var(--bg-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: '0.8rem',
            cursor: 'pointer',
            color: 'var(--text-secondary)'
          }}
        >
          Copy
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => reset()}
          style={{
            padding: '0.85rem 1.5rem',
            backgroundColor: 'var(--surface-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '99px',
            color: 'var(--text-primary)',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--border-color)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-color)'}
        >
          Try again
        </button>
        <button
          onClick={() => router.push('/')}
          style={{
            padding: '0.85rem 1.5rem',
            backgroundColor: 'var(--primary-accent)',
            border: 'none',
            borderRadius: '99px',
            color: 'white',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        >
          Go to Homepage
        </button>
      </div>
    </main>
  );
}
