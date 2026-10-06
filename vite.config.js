import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    // Instalação no celular e funcionamento offline. O service worker só existe
    // no build (npm run build + npm run preview), não no npm run dev.
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png', 'icone.svg'],
      manifest: {
        name: 'PyLingo',
        short_name: 'PyLingo',
        description: 'Aprenda Python com lições curtas, um pouquinho por dia.',
        lang: 'pt-BR',
        start_url: '.',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#3776AB',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Guarda tudo para abrir sem internet. Das fontes, só as latinas em woff2
        // (o português não usa as outras, e todo navegador atual lê woff2).
        globPatterns: ['**/*.{js,css,html,svg,png,ico}', '**/*-latin-*.woff2'],
      },
    }),
  ],
  // Deixa o servidor acessível pelo celular na mesma rede, sem precisar do --host.
  server: { host: true },
  preview: { host: true },
  test: {
    include: ['src/**/*.test.js'],
  },
})
