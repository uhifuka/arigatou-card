import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(160deg, #fff5f8 0%, #edf9e8 100%)',
          borderRadius: '6px',
        }}
      >
        <svg viewBox="0 0 160 148" width="28" height="26">
          <ellipse cx="80" cy="143" rx="30" ry="5" fill="#b8903a" opacity="0.2"/>
          <ellipse cx="52" cy="141" rx="9" ry="5" fill="#72b872"/>
          <ellipse cx="80" cy="139" rx="11" ry="5" fill="#82c882"/>
          <ellipse cx="108" cy="141" rx="9" ry="5" fill="#72b872"/>
          <path d="M70 142 Q68 118 70 104 Q74 91 80 88 Q86 91 90 104 Q92 118 90 142 Z" fill="#9b7040"/>
          <ellipse cx="72" cy="122" rx="5" ry="4" fill="#ffb3c9" opacity="0.6"/>
          <ellipse cx="88" cy="122" rx="5" ry="4" fill="#ffb3c9" opacity="0.6"/>
          <ellipse cx="75.5" cy="115" rx="2.5" ry="3" fill="#2d1e0e"/>
          <ellipse cx="84.5" cy="115" rx="2.5" ry="3" fill="#2d1e0e"/>
          <path d="M75 123 Q80 128 85 123" stroke="#2d1e0e" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
          <circle cx="57" cy="75" r="26" fill="#4daa4d"/>
          <circle cx="103" cy="75" r="26" fill="#4daa4d"/>
          <circle cx="80" cy="57" r="30" fill="#5cbd5c"/>
          <circle cx="68" cy="46" r="9" fill="#7add7a" opacity="0.45"/>
        </svg>
      </div>
    ),
    { ...size },
  );
}
