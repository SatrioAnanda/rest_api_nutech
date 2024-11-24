import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: './src/main.js', // File utama aplikasi
      output: {
        dir: './dist', // Folder output
        entryFileNames: 'main.js', // Nama file output
        format: 'cjs', // Format bundling (CommonJS)
      },
    },
    outDir: 'dist', // Menentukan folder output utama (opsional)
  },
});