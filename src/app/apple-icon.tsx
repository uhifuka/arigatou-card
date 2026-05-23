import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
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
          background: 'linear-gradient(135deg, #a8d5a2, #5aad55)',
          borderRadius: '36px',
        }}
      >
        <div style={{ fontSize: '96px', lineHeight: 1 }}>🍀</div>
        <div
          style={{
            fontSize: '22px',
            color: 'white',
            fontWeight: 700,
            marginTop: '4px',
            letterSpacing: '-0.5px',
          }}
        >
          ありがとう
        </div>
      </div>
    ),
    { ...size },
  );
}
