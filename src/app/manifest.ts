import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ありがとうカード',
    short_name: 'ありがとう',
    description: 'スタッフ同士で感謝を伝えるシステム',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff5f8',
    theme_color: '#7cc377',
    orientation: 'portrait',
    icons: [
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  };
}
