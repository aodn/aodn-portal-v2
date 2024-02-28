import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  const apiPath = process.env.VITE_API_HOST;

return defineConfig({
  server: {
    watch:{
        usePolling: true,
    },
    proxy: {
      '/api/v1/ogc/collections': {
        target: apiPath,
        changeOrigin: true
      },
      '/api/v1/ogc/tiles': {
        target: apiPath,
        changeOrigin: true
      }
    }
},
  plugins: [react()],
  build: {
    outDir: "dist"
  },
  publicDir: "public"
})
}