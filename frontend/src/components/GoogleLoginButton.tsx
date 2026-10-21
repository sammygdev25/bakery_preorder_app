import React, { useEffect, useRef, useState, useCallback } from 'react';
import { api } from '../api';

interface GoogleLoginButtonProps {
  onSuccess: (data: any) => void;
}

declare global {
  interface Window {
    google?: any;
  }
}

const GOOGLE_CLIENT_ID = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || '';
const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

function GoogleLoginButton({ onSuccess }: GoogleLoginButtonProps) {
  const buttonDivRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const handleCredentialResponse = useCallback(
    async (response: { credential: string }) => {
      setError(null);
      try {
        const data = await api.post('/auth/google/', { token: response.credential });
        if (data?.token) {
          localStorage.setItem('token', data.token);
        }
        onSuccess(data);
      } catch (err) {
        console.error('[GoogleLoginButton] Google sign-in failed:', err);
        setError('Could not sign in with Google. Please try again.');
      }
    },
    [onSuccess]
  );

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      return;
    }

    let script = document.querySelector<HTMLScriptElement>(`script[src="${GOOGLE_SCRIPT_SRC}"]`);

    const init = () => {
      if (!window.google || !buttonDivRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(buttonDivRef.current, {
        theme: 'filled_black',
        shape: 'pill',
        size: 'large',
        text: 'continue_with',
        width: 280,
      });
      setReady(true);
    };

    if (window.google) {
      init();
    } else if (script) {
      script.addEventListener('load', init);
    } else {
      script = document.createElement('script');
      script.src = GOOGLE_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.addEventListener('load', init);
      document.head.appendChild(script);
    }

    return () => {
      script?.removeEventListener('load', init);
    };
  }, [handleCredentialResponse]);

  if (!GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <div className="ds-stack" style={{ alignItems: 'center', gap: '0.5rem' }}>
      <div ref={buttonDivRef} />
      {!ready && (
        <span className="ds-small ds-muted">Loading Google sign-in…</span>
      )}
      {error && (
        <span className="ds-small" style={{ color: 'var(--color-danger)' }}>
          {error}
        </span>
      )}
    </div>
  );
}

export default GoogleLoginButton;