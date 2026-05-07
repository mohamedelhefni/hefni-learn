import { ImageResponse } from 'next/og';

export const alt = 'hefni·learn — Interactive Kubernetes Learning';

export const size = { width: 1200, height: 630 };

export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#09090b',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top gradient accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #6366f1)',
            display: 'flex',
          }}
        />

        {/* Faint large "k8s" watermark bottom-right */}
        <div
          style={{
            position: 'absolute',
            bottom: '-20px',
            right: '60px',
            display: 'flex',
            color: '#18181b',
            fontSize: '220px',
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-8px',
            userSelect: 'none',
          }}
        >
          k8s
        </div>

        {/* Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            marginBottom: '24px',
          }}
        >
          <span
            style={{
              fontSize: '88px',
              fontWeight: 800,
              color: '#6366f1',
              letterSpacing: '-3px',
              lineHeight: 1,
            }}
          >
            hefni
          </span>
          <span
            style={{
              fontSize: '88px',
              fontWeight: 800,
              color: '#fafafa',
              letterSpacing: '-3px',
              lineHeight: 1,
            }}
          >
            ·learn
          </span>
        </div>

        {/* Description */}
        <div
          style={{
            display: 'flex',
            fontSize: '28px',
            color: '#71717a',
            fontWeight: 400,
            lineHeight: 1.5,
            maxWidth: '680px',
            marginBottom: '52px',
          }}
        >
          Interactive Kubernetes learning — command practice, YAML debugging,
          and quizzes across 38 chapters.
        </div>

        {/* Pill tags */}
        <div style={{ display: 'flex', gap: '16px' }}>
          {(['38 chapters', 'kubectl practice', 'quizzes & scenarios'] as const).map(
            (label) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  padding: '10px 22px',
                  background: '#18181b',
                  border: '1px solid #3f3f46',
                  borderRadius: '8px',
                  color: '#a1a1aa',
                  fontSize: '20px',
                }}
              >
                {label}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
