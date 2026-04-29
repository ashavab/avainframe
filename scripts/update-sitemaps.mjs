import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const today = new Date().toISOString().slice(0, 10);
const targets = ["public/sitemap.xml", "public/sitemap-images.xml"];

for (const relativePath of targets) {
  const filePath = resolve(process.cwd(), relativePath);
  const input = readFileSync(filePath, "utf8");
  const output = input.replace(/<lastmod>[^<]+<\/lastmod>/g, `<lastmod>${today}</lastmod>`);
  writeFileSync(filePath, output, "utf8");
}

console.log(`Updated sitemap lastmod values to ${today}`);
