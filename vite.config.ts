import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const certDir = join(homedir(), '.vite-plugin-mkcert')

const config = defineConfig({
  plugins: [
    devtools(),
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  server: {
    https: {
      key: readFileSync(join(certDir, 'dev.pem')),
      cert: readFileSync(join(certDir, 'cert.pem')),
    },
  },
  optimizeDeps: {
    exclude: ['@tanstack/start-server-core'],
  },
})

export default config
