import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { version } from './package.json'

const certDir = join(homedir(), '.vite-plugin-mkcert')
const certPath = join(certDir, 'cert.pem')
const keyPath = join(certDir, 'dev.pem')
const hasCerts = existsSync(certPath) && existsSync(keyPath)

const config = defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(process.env.APP_VERSION ?? version),
  },
  plugins: [
    devtools(),
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  server: {
    https: hasCerts
      ? { key: readFileSync(keyPath), cert: readFileSync(certPath) }
      : undefined,
  },
  optimizeDeps: {
    exclude: ['@tanstack/start-server-core'],
  },
})

export default config
