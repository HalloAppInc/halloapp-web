import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import basicSsl from '@vitejs/plugin-basic-ssl' // needed for dev https host, will auto generate ssl cert

export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 3000,
        https: true  
    },  
    plugins: [
        basicSsl(),
        vue(),
        /* add vueI18n to get rid of console warning - https://github.com/intlify/vue-i18n-next/issues/810 */
        vueI18n({
            include: path.resolve(__dirname, './src/locales/**')
        })        
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        }
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
    },
    optimizeDeps:{
        esbuildOptions:{
            plugins:[
            ]
        }
    } 
})
