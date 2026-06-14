import express from "express";
import serverless from "serverless-http";
import { createRouter } from "../../server/routes";
import { MemStorage } from "../../server/storage";

const app = express();
const storage = new MemStorage();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

app.use(express.json({ limit: "50mb" }));

app.use((req, _res, next) => {
  const functionPrefix = "/.netlify/functions/api";
  if (req.url.startsWith(functionPrefix)) {
    req.url = req.url.slice(functionPrefix.length) || "/";
  }
  if (!req.url.startsWith("/api")) {
    req.url = `/api${req.url.startsWith("/") ? "" : "/"}${req.url}`;
  }
  next();
});

app.use(createRouter(storage));

export const handler = serverless(app);
