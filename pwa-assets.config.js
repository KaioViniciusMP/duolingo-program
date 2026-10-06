import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

// Gera os ícones PNG do app a partir de public/icone.svg: npx pwa-assets-generator
export default defineConfig({
  preset: {
    ...minimal2023Preset,
    maskable: { ...minimal2023Preset.maskable, padding: 0, resizeOptions: { background: '#ffd43b' } },
    apple: { ...minimal2023Preset.apple, padding: 0, resizeOptions: { background: '#ffd43b' } },
  },
  images: ['public/icone.svg'],
})
