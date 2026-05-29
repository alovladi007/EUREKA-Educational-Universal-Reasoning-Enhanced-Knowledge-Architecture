'use client';

/**
 * Last-resort error boundary for crashes in the root layout itself
 * (P3-6). When app/layout.tsx throws during render — e.g. Providers
 * crash, a hook misuse propagates up, the theme/auth wiring errors —
 * the regular `app/error.tsx` can't help: it's a CHILD of the layout
 * that just died.
 *
 * `global-error.tsx` replaces the whole document, so it MUST render
 * its own <html>/<body>. Per the Next App Router docs we keep the
 * markup deliberately minimal: no providers, no Tailwind dependency
 * tree (Tailwind is JIT-compiled from the rest of the tree which may
 * itself be broken). Pure inline styles so this works even if the
 * stylesheet chain is the thing that crashed.
 */

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDev = process.env.NODE_ENV !== 'production';

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          background: 'linear-gradient(135deg, #fff7ed 0%, #ffe4e6 100%)',
          color: '#111827',
        }}
      >
        <div
          style={{
            maxWidth: '540px',
            width: '100%',
            background: '#ffffff',
            border: '2px solid #fecaca',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f43f5e, #f97316)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                lineHeight: '1',
                fontWeight: 700,
              }}
              aria-hidden="true"
            >
              !
            </div>
            <h1 style={{ fontSize: '20px', margin: 0, color: '#7f1d1d' }}>
              The application failed to load
            </h1>
          </div>

          <p
            style={{
              fontSize: '14px',
              color: '#9f1239',
              lineHeight: 1.55,
              marginTop: '4px',
              marginBottom: '20px',
            }}
          >
            Something at the root of the app crashed. Try reloading; if it
            keeps happening, copy the digest below when reporting it.
          </p>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={reset}
              style={{
                background: '#dc2626',
                color: '#fff',
                border: 0,
                borderRadius: '8px',
                padding: '10px 16px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                background: '#ffffff',
                color: '#9f1239',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '10px 16px',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Reload home
            </a>
          </div>

          <div
            style={{
              marginTop: '20px',
              padding: '12px 14px',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              background: '#fff1f2',
              fontSize: '12px',
              color: '#7f1d1d',
            }}
          >
            <div style={{ fontFamily: 'ui-monospace, monospace', wordBreak: 'break-word' }}>
              {error?.message || 'No message'}
            </div>
            {error?.digest && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', opacity: 0.7 }}>
                  Digest
                </div>
                <div style={{ fontFamily: 'ui-monospace, monospace', wordBreak: 'break-all' }}>
                  {error.digest}
                </div>
              </div>
            )}
            {isDev && error?.stack && (
              <pre
                style={{
                  marginTop: '8px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  maxHeight: '180px',
                  overflow: 'auto',
                  fontSize: '10px',
                  fontFamily: 'ui-monospace, monospace',
                }}
              >
                {error.stack}
              </pre>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
