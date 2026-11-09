import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "node:path"
import fs from "node:fs"

// Vite config — https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "serve-agenda-db",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === "/agenda.db" || req.url === "/data/agenda.db") {
            const dbPath = path.resolve(__dirname, "./data/agenda.db")
            if (fs.existsSync(dbPath)) {
              res.setHeader("Content-Type", "application/x-sqlite3")
              res.setHeader("Cache-Control", "no-cache")
              fs.createReadStream(dbPath).pipe(res)
              return
            }
          }
          next()
        })
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: parseInt(process.env.PORT || "8443"),
  },
  preview: {
    host: "0.0.0.0",
    port: parseInt(process.env.PORT || "8443"),
  },
})
