import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@emotion/is-prop-valid": "@emotion/is-prop-valid/dist/emotion-is-prop-valid.esm.js",
    },
  },

  optimizeDeps: {
    include: ["@emotion/is-prop-valid"],
  },

  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/, /@emotion\/is-prop-valid/],
    },
  },

  publicDir: "public",
  assetsInclude: ["**/*.svg", "**/*.csv"],
});
