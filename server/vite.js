import { createServer as createViteServer } from "vite";

export async function createViteMiddleware(app) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });

  app.use(vite.ssrFix);
  app.use(vite.middlewares);
}