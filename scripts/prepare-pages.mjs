import fs from "node:fs/promises";
import path from "node:path";

const distDir = path.join(process.cwd(), "dist");
const indexPath = path.join(distDir, "index.html");

const routes = [
  "a-la-carte-menu",
  "about",
  "press",
  "events",
  "functions-catering",
  "gift-cards",
  "contact",
  "impressum",
  "en",
  "en/menu",
  "en/functions",
  "en/giftcards",
];

await fs.copyFile(indexPath, path.join(distDir, "404.html"));

for (const route of routes) {
  const routeDir = path.join(distDir, route);
  await fs.mkdir(routeDir, { recursive: true });
  await fs.copyFile(indexPath, path.join(routeDir, "index.html"));
}

console.log(`Prepared GitHub Pages fallback and ${routes.length} route entry files.`);
