import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';
import type { ServerOptions } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const serverConfig: ServerOptions = {
    host: "::",
    port: 8080,
    proxy: {
      '/api/webhook': {
        target: 'http://localhost:5678',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api\/webhook/, '/webhook')
      }
    }
  };

  // Add HTTPS configuration for development
  if (mode === 'development') {
    try {
      const keyPath = path.resolve(__dirname, '../backend/ssl/private-key.pem');
      const certPath = path.resolve(__dirname, '../backend/ssl/certificate.pem');
      
      if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
        serverConfig.https = {
          key: fs.readFileSync(keyPath),
          cert: fs.readFileSync(certPath)
        };
      }
    } catch (error) {
      console.warn('Could not load HTTPS certificates, falling back to HTTP');
    }
  }

  // Add HTTPS configuration for development
  if (mode === 'development') {
    try {
      const keyPath = path.resolve(__dirname, '../backend/ssl/private-key.pem');
      const certPath = path.resolve(__dirname, '../backend/ssl/certificate.pem');
      
      if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
        serverConfig.https = {
          key: fs.readFileSync(keyPath),
          cert: fs.readFileSync(certPath)
        };
        console.log('🔒 HTTPS enabled for frontend development server');
      } else {
        console.log('⚠️  HTTPS certificates not found, using HTTP');
      }
    } catch (error) {
      console.warn('Could not load HTTPS certificates, falling back to HTTP:', error);
    }
  }

  return {
    server: serverConfig,
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
