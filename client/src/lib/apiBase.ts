const raw = import.meta.env.VITE_API_BASE_URL ?? "";
const base = raw.replace(/\/$/, "");

/**
 * Full URL for an API path. When VITE_API_BASE_URL is unset (local dev with Vite proxy), uses same-origin relative paths.
 */
export function apiUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const p = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${p}` : p;
}
