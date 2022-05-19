import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    server: {
        host: '0.0.0.0',
        https: true  
    },  
    plugins: [
        vue(),
    ],
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
    },
    optimizeDeps:{
        esbuildOptions:{
            plugins:[
            ]
        }
    } 
})
