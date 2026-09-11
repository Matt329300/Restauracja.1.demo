// Prosty serwer statyczny do podglądu strony lokalnie.
// Użycie: node dev-server.mjs  ->  http://localhost:4321
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const ROOT = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 4321;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".json": "application/json",
  ".pdf": "application/pdf",
};

createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (p === "/" || p.endsWith("/")) p += "index.html";
    const file = normalize(join(ROOT, p));
    if (!file.startsWith(normalize(ROOT))) {
      res.writeHead(403).end();
      return;
    }
    await stat(file);
    const body = await readFile(file);
    res.writeHead(200, {
      "Content-Type": TYPES[extname(file).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store, must-revalidate",
    });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" }).end("404");
  }
}).listen(PORT, () => console.log("Podgląd działa pod http://localhost:" + PORT));
