'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function GlobalFooter() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <footer style={{ 
      width: '100%', 
      borderTop: '1px solid var(--border-color)', 
      background: 'var(--surface-color)', 
      padding: '1.5rem 1rem', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      marginTop: 'auto'
    }}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ 
          background: 'transparent', 
          border: 'none', 
          color: 'var(--text-secondary)', 
          fontSize: '0.95rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          cursor: 'pointer', 
          fontWeight: 600 
        }}
      >
        More information {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div style={{ 
          marginTop: '1.5rem', 
          maxWidth: '480px', 
          textAlign: 'center', 
          color: 'var(--text-secondary)', 
          fontSize: '0.95rem', 
          lineHeight: 1.6,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <p style={{ marginBottom: '1.5rem' }}>
            There will be a lot more free features that you can use. Let's help each other by giving me feedback. You can request any feature, and I'll do my best to build it in my free time.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a 
              href="https://wa.me/6287773298907" 
              target="_blank" 
              rel="noreferrer" 
              style={{ 
                padding: '10px 20px', 
                background: '#25D366', 
                color: 'white', 
                borderRadius: '99px', 
                textDecoration: 'none', 
                fontWeight: 600,
                boxShadow: '0 4px 6px -1px rgba(37, 211, 102, 0.2)'
              }}
            >
              WhatsApp Me
            </a>
            
            <a 
              href="mailto:stevenmulya@gmail.com" 
              style={{ 
                padding: '10px 20px', 
                background: 'var(--primary-accent)', 
                color: 'white', 
                borderRadius: '99px', 
                textDecoration: 'none', 
                fontWeight: 600,
                boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.2)'
              }}
            >
              Email Me
            </a>
          </div>
        </div>
      )}
    </footer>
  );
}
