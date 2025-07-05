import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import { ssr } from 'vite-plugin-ssr/plugin'

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
      '~': '/public',
    },
  },
  plugins: [react(), ssr({ prerender: true })],
})
