
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import path from 'path'

export default defineConfig({
  plugins: [
    createVuePlugin(),
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src')
      }
    ]
  },
  css: {
    preprocessorOptions: {
      scss: {
        sourceMap: true,
        additionalData: `@import "@/assets/scss/_variables.scss"; `,
      },
    },
  }, 
})