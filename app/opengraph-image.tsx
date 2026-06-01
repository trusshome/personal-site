import { ImageResponse } from 'next/og';

export const alt = 'entity resoLOUtion';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// The hex below mirrors the tokens in globals.css (paper, ink, signal, slate).
// ImageResponse renders outside the DOM, so CSS variables are not available here.
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
          background: '#F7F5F0',
          color: '#14171C',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 104, fontWeight: 600, letterSpacing: '-0.03em' }}>
          <span>entity reso</span>
          <span style={{ color: '#2F6BFF' }}>LOU</span>
          <span>tion</span>
        </div>
        <div style={{ display: 'flex', marginTop: 32, fontSize: 34, color: '#5A626E' }}>
          I take messy problems and ship one clear answer.
        </div>
      </div>
    ),
    { ...size },
  );
}
