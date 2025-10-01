// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// This is the standard configuration for running a local dev server.
export default defineConfig({
  plugins: [react()],
});