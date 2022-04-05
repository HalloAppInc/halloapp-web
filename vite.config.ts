import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    https: true  
  },
  build: {
    minify: 'terser',
    terserOptions: {
      keep_classnames: false,
      keep_fnames: false,      
      toplevel: true,
      parse: {
        html5_comments: false
      }
    }
  }
})
