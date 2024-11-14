import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['ace-builds'],
    exclude: ['lucide-react']
  },
  server: {
    fs: {
      strict: false // Allow serving files from node_modules
    }
  },
	base: "/client/editor/",
	build: {
		outDir: "docs",
	},
});
