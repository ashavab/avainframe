import fs from 'fs/promises';
import path from 'path';

const PUBLIC_GALLERIES = path.join(process.cwd(), 'public', 'galleries');
const OUT_FILE = path.join(process.cwd(), 'src', 'app', 'data', 'portfolioGenerated.ts');

// Helper to format image filename as caption
function filenameToCaption(filename) {
  let name = filename.replace(/\.[^.]+$/, '');
  name = name.replace(/^\d{4}-\d{2}-\d{2}-/, '');
  return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Helper to find the head image for a gallery
function findHeadImage(images, category) {
  for (const ext of ['jpg', 'jpeg', 'png', 'webp', 'gif', 'tif', 'heic']) {
    const catFile = `${category}.${ext}`;
    if (images.includes(catFile)) return catFile;
  }
  for (const pattern of ['head', 'cover']) {
    const match = images.find(f => f.toLowerCase().startsWith(pattern + '.'));
    if (match) return match;
  }
  return images[0];
}

function generateGalleryHTML(category, images, headImage) {
  const categoryTitle = category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const thumbs = images
    .map(img => {
      const caption = filenameToCaption(img);
      return `\n    <a href="${img}" class="gallery-item" title="${caption}">\n      <img src="${img}" alt="${caption}" loading="lazy" />\n      <div class="gallery-caption">${caption}</div>\n    </a>`;
    })
    .join('\n');

  return `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>${categoryTitle} Gallery</title>\n  <style>\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; color: #333; }\n    .container { max-width: 1400px; margin: 0 auto; padding: 20px; }\n    .hero { margin-bottom: 40px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }\n    .hero img { width: 100%; height: auto; display: block; max-height: 500px; object-fit: cover; }\n    .hero-content { background: white; padding: 30px; text-align: center; }\n    .hero-content h1 { font-size: 2.5rem; margin-bottom: 10px; color: #1a1a1a; }\n    .hero-content p { font-size: 1.1rem; color: #666; line-height: 1.6; }\n    .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px,1fr)); gap: 20px; margin-top: 20px; }\n    .gallery-item { position: relative; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform .3s, box-shadow .3s; display: block; text-decoration: none; background: white; aspect-ratio: 3/2; }\n    .gallery-item:hover { transform: translateY(-4px); box-shadow: 0 8px 16px rgba(0,0,0,0.2); }\n    .gallery-item img { width:100%; height:100%; object-fit:cover; display:block; }\n    .gallery-caption { position:absolute; bottom:0; left:0; right:0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); color: white; padding: 20px 15px 15px; font-size: .95rem; font-weight:500; text-align:left; opacity:0; transition: opacity .3s; }\n    .gallery-item:hover .gallery-caption { opacity: 1; }\n    @media (max-width:768px) { .hero-content h1 { font-size:2rem } .gallery-grid{ grid-template-columns: repeat(auto-fill,minmax(200px,1fr)); gap:15px } }\n    @media (max-width:480px) { .container{ padding:10px } .hero-content{ padding:20px } .hero-content h1{ font-size:1.5rem } .gallery-grid{ grid-template-columns: repeat(auto-fill,minmax(150px,1fr)); gap:10px } }\n  </style>\n</head>\n<body>\n  <div class="container">\n    <div class="hero">\n      <img src="${headImage}" alt="${categoryTitle}" />\n      <div class="hero-content">\n        <h1>${categoryTitle}</h1>\n        <p>Browse our ${categoryTitle.toLowerCase()} photography collection</p>\n      </div>\n    </div>\n\n    <div class="gallery-grid">\n${thumbs}\n    </div>\n  </div>\n</body>\n</html>`;
}

function generateEmptyGalleryHTML(category) {
  const categoryTitle = category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>${categoryTitle} Gallery</title>\n  <style>\n    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; color: #333; }\n    .container { max-width: 900px; margin: 0 auto; padding: 40px 20px; text-align: center; }\n    .message { background: white; border-radius: 18px; padding: 40px 30px; box-shadow: 0 12px 30px rgba(0,0,0,0.08); }\n    h1 { font-size: 2.5rem; margin-bottom: 20px; }\n    p { font-size: 1.05rem; line-height: 1.7; color: #555; }\n    a { color: #1f6feb; text-decoration: none; font-weight: 600; }\n  </style>\n</head>\n<body>\n  <div class="container">\n    <div class="message">\n      <h1>${categoryTitle} Gallery</h1>\n      <p>This gallery is ready for your images. Drop photos into <strong>public/galleries/${category}</strong> and run <code>npm run galleries:generate</code>.</p>\n      <p>Once images are added, this page will update automatically.</p>\n    </div>\n  </div>\n</body>\n</html>`;
}

const CATEGORIES = [
  'newborn',
  'boudoir',
  'headshots',
  'weddings',
  'real-estate'
];

const CATEGORY_METADATA = {
  portraits: { title: 'Portraits', description: 'Timeless personal and lifestyle portraits capturing authentic expressions.', defaultImage: '/IMG_0158.jpeg' },
  family: { title: 'Family', description: 'Warm and authentic lifestyle photography celebrating family connections.', defaultImage: '/IMG_0158.jpeg' },
  newborn: { title: 'Newborn', description: 'Gentle photography celebrating new life.', defaultImage: '/IMG_0158.jpeg' },
  boudoir: { title: 'Boudoir Photography', description: 'Private boudoir sessions that celebrate confidence and intimate artistry.', defaultImage: '/ashleigh.jpg' },
  headshots: { title: 'Professional Headshots', description: 'Clean corporate and personal branding headshots for your professional image.', defaultImage: '/window.jpeg' },
  weddings: { title: 'Wedding Photography', description: 'Editorial wedding photography with a modern Toronto celebration feel.', defaultImage: '/DSC06596.jpg' },
  events: { title: 'Events', description: 'Coverage for parties and celebrations.', defaultImage: '/DSC07060.jpg' },
  'real-estate': { title: 'Real Estate Photography', description: 'Beautiful real estate photography designed to make listings stand out.', defaultImage: '/DSC06596.jpg' },
  pets: { title: 'Pet Photography', description: 'Fun, character-driven portraits of pets and their people.', defaultImage: '/avana.jpg' }
};

async function generate() {
  const entries = [];

  for (const catName of CATEGORIES) {
    const meta = CATEGORY_METADATA[catName] || { title: catName, description: '', defaultImage: '' };
    const catPath = path.join(PUBLIC_GALLERIES, catName);
    
    // Ensure directory exists
    await fs.mkdir(catPath, { recursive: true });

    const files = await fs.readdir(catPath);
    const images = files.filter(f => /\.(jpe?g|png|webp|gif|tif|heic)$/i.test(f)).sort().reverse();
    const indexPath = path.join(catPath, 'index.html');
    const manifestPath = path.join(catPath, 'gallery.json');

    if (images.length === 0) {
      const placeholderHTML = generateEmptyGalleryHTML(catName);
      await fs.writeFile(indexPath, placeholderHTML, 'utf8');
      await fs.writeFile(manifestPath, JSON.stringify([], null, 2), 'utf8');
      console.log(`Wrote placeholder ${indexPath}`);
      console.log(`Wrote placeholder ${manifestPath}`);
      // Skip pushing to entries list so empty categories are hidden on homepage portfolio section
      continue;
    }

    const headImage = findHeadImage(images, catName);

    // write per-gallery index.html
    const galleryHTML = generateGalleryHTML(catName, images, headImage);
    await fs.writeFile(indexPath, galleryHTML, 'utf8');
    console.log(`Wrote ${indexPath}`);

    // write per-gallery JSON manifest for in-app rendering
    const manifest = images.map(img => ({ src: `/galleries/${catName}/${img}`, caption: filenameToCaption(img) }));
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
    console.log(`Wrote ${manifestPath}`);

    const thumbnail = `/galleries/${catName}/${headImage}`;
    entries.push({
      title: meta.title,
      category: catName,
      date: '',
      description: meta.description,
      imageUrl: thumbnail,
      galleryLink: `/galleries/${catName}/`
    });
  }

  const fileContent = `export const generatedEntries = ${JSON.stringify(entries, null, 2)} as const;\n`;
  await fs.writeFile(OUT_FILE, fileContent, 'utf8');
  console.log('Wrote', OUT_FILE);
}

generate().catch(err => { console.error(err); process.exitCode = 1; });
