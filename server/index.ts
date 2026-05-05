import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createRouter } from "./routes.js";
import { MemStorage } from "./storage.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || "3000");

const storage = new MemStorage();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
app.use(express.json({ limit: "50mb" }));

const publicPath = path.resolve(__dirname, "..", "public");
// Same files at /file and /public/file so static hosts (Netlify root publish) and Express match
app.use(
  express.static(publicPath, {
    maxAge: process.env.NODE_ENV === "production" ? "1h" : 0,
    setHeaders(res, filePath) {
      if (filePath.endsWith(".html") || filePath.endsWith(".svg")) {
        res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
      }
    },
  })
);
app.use(
  "/public",
  express.static(publicPath, {
    maxAge: process.env.NODE_ENV === "production" ? "1h" : 0,
    setHeaders(res, filePath) {
      if (filePath.endsWith(".svg")) {
        res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
      }
    },
  })
);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

const router = createRouter(storage);
console.log("Router created, mounting API routes...");
app.use(router);

app.use((req, res) => {
  console.log("Catch-all route hit for:", req.path);
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.sendFile(path.resolve(__dirname, "..", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Mental Health Support app running on http://0.0.0.0:${PORT}`);
});
