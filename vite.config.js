import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Deixa o servidor acessível pelo celular na mesma rede, sem precisar do --host.
  server: { host: true },
  test: {
    include: ['src/**/*.test.js'],
  },
})
