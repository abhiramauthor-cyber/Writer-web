import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Writer Lokam',
    short_name: 'Writer Lokam',
    description: 'A digital reading room by author Abhiram R',
    start_url: '/',
    display: 'standalone',
    background_color: '#F4F1ED', // paper color
    theme_color: '#F4F1ED',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
