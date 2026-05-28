import fs from 'fs/promises';
import path from 'path';

const PUBLIC_GALLERIES = path.join(process.cwd(), 'public', 'galleries');
const OUT_FILE = path.join(process.cwd(), 'src', 'app', 'data', 'portfolioGenerated.ts');

async function generate() {
  const categories = await fs.readdir(PUBLIC_GALLERIES, { withFileTypes: true });
  const entries = [];

  for (const dirent of categories) {
    if (!dirent.isDirectory()) continue;
    const catName = dirent.name;
    const catPath = path.join(PUBLIC_GALLERIES, catName);
    const files = await fs.readdir(catPath);
    const images = files.filter(f => /\.(jpe?g|png|webp|gif|tif|heic)$/i.test(f));
    if (images.length === 0) continue;

    const thumbnail = `/galleries/${catName}/${images[0]}`;
    entries.push({
      title: catName.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      category: catName,
      date: new Date().toISOString().slice(0,10),
      description: `Auto-generated gallery for ${catName}`,
      imageUrl: thumbnail,
      galleryLink: `/galleries/${catName}/`
    });
  }

  const fileContent = `export const generatedEntries = ${JSON.stringify(entries, null, 2)} as const;\n`;
  await fs.writeFile(OUT_FILE, fileContent, 'utf8');
  console.log('Wrote', OUT_FILE);
}

generate().catch(err => { console.error(err); process.exitCode = 1; });
