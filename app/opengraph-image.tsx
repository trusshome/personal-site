import { ImageResponse } from 'next/og';

export const alt = 'entity resoLOUtion';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Hex mirrors tokens in globals.css. ImageResponse runs outside the DOM
// so CSS variables are not available here.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#14171C',
          color: '#F7F5F0',
          fontFamily: 'sans-serif',
          padding: '0 80px',
        }}
      >
        {/* Subtle grid lines to echo the WebGL shader feel */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(47,107,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(47,107,255,0.06) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Wordmark */}
        <div
          style={{
            display: 'flex',
            fontSize: 96,
            fontWeight: 600,
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          <span style={{ color: '#F7F5F0' }}>entity reso</span>
          <span style={{ color: '#2F6BFF' }}>LOU</span>
          <span style={{ color: '#F7F5F0' }}>tion</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: 'flex',
            marginTop: 36,
            fontSize: 30,
            color: '#5A626E',
            letterSpacing: '-0.01em',
            textAlign: 'center',
          }}
        >
          I take messy problems and ship one clear answer.
        </div>

        {/* Domain pill */}
        <div
          style={{
            display: 'flex',
            marginTop: 52,
            padding: '10px 28px',
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.12)',
            fontSize: 20,
            color: 'rgba(247,245,240,0.45)',
            letterSpacing: '0.04em',
          }}
        >
          www.entityresoloution.com
        </div>
      </div>
    ),
    { ...size },
  );
}
