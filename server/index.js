// Robust Express server that serves bundled CRA from server/public
const path = require("path")
const fs = require("fs")
const express = require("express")
const cors = require("cors")

const app = express()
const PORT = process.env.PORT || 8080

app.use(cors())
app.use(express.json())

// API routes first
app.get("/api/health", (_req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() })
})
app.get("/api/status", (_req, res) => {
  res.json({ api: "HydrateMate API", version: "bundled-on-railway", ts: new Date().toISOString() })
})

// Resolve SPA build path regardless of CWD
const candidates = [
  path.resolve(__dirname, "public"),
  path.resolve(process.cwd(), "server/public"),
  path.resolve(process.cwd(), "public"),
]
let buildDir = candidates[0]
let indexPath = path.join(buildDir, "index.html")
for (const dir of candidates) {
  const idx = path.join(dir, "index.html")
  if (fs.existsSync(idx)) {
    buildDir = dir
    indexPath = idx
    break
  }
}

console.log("🧭 __dirname:", __dirname)
console.log("🧭 process.cwd():", process.cwd())
console.log("🎯 Trying SPA at:", indexPath)

if (fs.existsSync(indexPath)) {
  console.log("🎨 Serving frontend from", buildDir)
  app.use(express.static(buildDir))
} else {
  console.warn("⚠️  Frontend build not found at:", indexPath)
}

// SPA fallback after API routes
app.get("*", (_req, res) => {
  if (fs.existsSync(indexPath)) return res.sendFile(indexPath)
  res.status(500).send("Frontend build not found. CRA must build and copy to server/public during Railway build.")
})

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server listening on http://0.0.0.0:${PORT}`)
})
