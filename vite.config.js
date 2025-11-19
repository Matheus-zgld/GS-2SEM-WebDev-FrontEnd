import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Garante que as variáveis de ambiente do arquivo .env sejam carregadas
  process.env = {...process.env, ...loadEnv(mode, process.cwd(), '')};

  return {
    plugins: [react(),
      tailwindcss(),
    ],
  };
});