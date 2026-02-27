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
app.use(express.static(path.resolve(__dirname, "..", "public")));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(createRouter(storage));

app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Mental Health Support app running on http://0.0.0.0:${PORT}`);
});
