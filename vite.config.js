import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

<<<<<<< HEAD
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
=======
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist'
  }
>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
})