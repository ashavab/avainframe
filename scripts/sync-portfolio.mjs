import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// 1. Load env variables if .env file exists
const envPath = path.join(process.cwd(), '.env');
const env = {};
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      env[match[1]] = value.trim();
    }
  });
}

const IMMICH_URL = env.VITE_IMMICH_URL || process.env.VITE_IMMICH_URL || 'https://photos.avainframe.com';
const SHARE_KEY = env.VITE_IMMICH_SHARE_KEY || process.env.VITE_IMMICH_SHARE_KEY;

if (!SHARE_KEY) {
  console.error('Error: VITE_IMMICH_SHARE_KEY or VITE_IMMICH_SHARE_KEY env variable is not defined.');
  process.exit(1);
}

// Categories list
const CATEGORIES = [
  'newborn',
  'boudoir',
  'headshots',
  'weddings',
  'real-estate'
];

// Hardcoded mapping for existing 60 photos
const KNOWN_ASSETS = {
  // Band photos -> events
  '5f3f461f-c3ae-4a57-a9cb-3ef327897817': 'events',
  '613ff316-a0b6-4e78-b9fc-67af1ac14b74': 'events',
  'a5420ac9-e066-42fa-aa0a-e7ee1cd68e6a': 'events',
  '0b735bff-db62-4592-a802-c06e6166b365': 'events',
  'DSC01794.png': 'events',
  'DSC01782.png': 'events',
  'DSC01755.png': 'events',
  'DSC01739.png': 'events',

  // Baby photos -> newborn
  'a9cdface-6f49-4667-b29a-97e345215996': 'newborn',
  'a54c1bf9-62e3-4156-9dcd-228fe70163ac': 'newborn',
  '96ba43b4-66d4-4857-9944-c27ddd7979b5': 'newborn',
  'DSC02216.png': 'newborn',
  'DSC01828.png': 'newborn',
  'DSC01816.png': 'newborn',
};

// Keyword mapping for auto-classification of new photos
const KEYWORD_MAP = {
  portraits: ['portrait', 'portraits', 'lifestyle'],
  family: ['family', 'families', 'couple'],
  newborn: ['newborn', 'baby', 'infant', 'toddler'],
  boudoir: ['boudoir', 'intimate', 'sensual'],
  headshots: ['headshot', 'headshots', 'corporate', 'branding', 'professional'],
  weddings: ['wedding', 'weddings', 'bride', 'groom', 'marriage', 'nuptials'],
  events: ['event', 'events', 'band', 'concert', 'performance', 'show', 'gig'],
  'real-estate': ['real-estate', 'realestate', 'property', 'house', 'interior', 'architecture', 'home', 'listing'],
  pets: ['pet', 'pets', 'dog', 'cat', 'animal', 'puppy', 'kitten']
};

function determineCategory(asset) {
  const description = (asset.description || (asset.exifInfo && asset.exifInfo.description) || '').toLowerCase().trim();

  // 1. Prioritize user description from Immich (if set)
  if (description) {
    for (const cat of ['portraits', 'family', 'newborn', 'boudoir', 'headshots', 'weddings', 'events', 'real-estate', 'pets']) {
      const keywords = KEYWORD_MAP[cat];
      if (keywords.some(kw => description.includes(kw))) {
        return cat;
      }
    }
  }

  // 2. Fall back to pre-seeded known assets mapping if no description matches
  if (KNOWN_ASSETS[asset.id]) return KNOWN_ASSETS[asset.id];
  if (KNOWN_ASSETS[asset.originalFileName]) return KNOWN_ASSETS[asset.originalFileName];

  // 3. Fall back to filename and tags
  const filename = (asset.originalFileName || '').toLowerCase();
  const tags = (asset.tags || []).map(t => (t.name || '').toLowerCase());
  const textToScan = `${filename} ${tags.join(' ')}`;

  for (const cat of ['portraits', 'newborn', 'boudoir', 'headshots', 'weddings', 'events', 'real-estate', 'pets']) {
    const keywords = KEYWORD_MAP[cat];
    if (keywords.some(kw => textToScan.includes(kw))) {
      return cat;
    }
  }

  // 4. Default to family
  return 'family';
}

async function downloadAsset(asset, category) {
  const baseName = path.parse(asset.originalFileName).name;
  const destDir = path.join(process.cwd(), 'public', 'galleries', category);
  fs.mkdirSync(destDir, { recursive: true });
  const destPath = path.join(destDir, `${baseName}.jpg`);

  if (fs.existsSync(destPath)) {
    console.log(`  Skipping existing: ${destPath}`);
    return destPath;
  }

  console.log(`  Downloading preview for ${asset.originalFileName} -> ${destPath}`);
  const url = `${IMMICH_URL}/api/assets/${asset.id}/thumbnail?key=${SHARE_KEY}&size=preview`;
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download asset ${asset.id}: status ${res.status}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(destPath, buffer);
  return destPath;
}

async function run() {
  console.log(`Starting Immich sync from ${IMMICH_URL}...`);
  
  // 1. Get shared link info to find the albumId
  console.log('Fetching shared link info...');
  const meRes = await fetch(`${IMMICH_URL}/api/shared-links/me`, {
    headers: { 'x-immich-share-key': SHARE_KEY }
  });
  
  if (!meRes.ok) {
    throw new Error(`Failed to fetch shared link info: status ${meRes.status}`);
  }
  const sharedLink = await meRes.json();
  const albumId = sharedLink.album ? sharedLink.album.id : null;
  if (!albumId) {
    throw new Error('Shared link is not an album, or album ID was not found.');
  }
  
  console.log(`Found album ID: ${albumId}. Fetching album assets...`);
  
  // 2. Get album info which contains assets array
  const albumRes = await fetch(`${IMMICH_URL}/api/albums/${albumId}`, {
    headers: { 'x-immich-share-key': SHARE_KEY }
  });
  if (!albumRes.ok) {
    throw new Error(`Failed to fetch album assets: status ${albumRes.status}`);
  }
  const albumData = await albumRes.json();
  const assets = albumData.assets || [];
  console.log(`Album contains ${assets.length} assets.`);
  
  const expectedPaths = new Set();
  
  // 3. Process and download assets
  for (const asset of assets) {
    const category = determineCategory(asset);
    try {
      const savedPath = await downloadAsset(asset, category);
      expectedPaths.add(savedPath);
    } catch (err) {
      console.error(`Error downloading asset ${asset.originalFileName}:`, err);
    }
  }
  
  // 4. Clean up any obsolete local files in category directories
  console.log('Cleaning up obsolete files...');
  for (const cat of CATEGORIES) {
    const catDir = path.join(process.cwd(), 'public', 'galleries', cat);
    if (!fs.existsSync(catDir)) continue;
    
    const files = fs.readdirSync(catDir);
    for (const file of files) {
      // Keep index.html and gallery.json or subdirectories
      if (file === 'index.html' || file === 'gallery.json' || file === '.DS_Store') continue;
      const fullPath = path.join(catDir, file);
      if (fs.statSync(fullPath).isDirectory()) continue;
      
      if (!expectedPaths.has(fullPath)) {
        console.log(`  Deleting obsolete file: ${fullPath}`);
        fs.unlinkSync(fullPath);
      }
    }
  }

  // 4b. Clean up any obsolete category directories that are not in the CATEGORIES list
  console.log('Cleaning up obsolete category folders...');
  const galleriesBaseDir = path.join(process.cwd(), 'public', 'galleries');
  if (fs.existsSync(galleriesBaseDir)) {
    const folders = fs.readdirSync(galleriesBaseDir);
    for (const folder of folders) {
      if (folder === '.DS_Store') continue;
      const folderPath = path.join(galleriesBaseDir, folder);
      if (fs.statSync(folderPath).isDirectory()) {
        if (!CATEGORIES.includes(folder)) {
          console.log(`  Deleting obsolete category folder: ${folderPath}`);
          fs.rmSync(folderPath, { recursive: true, force: true });
        }
      }
    }
  }
  
  // 5. Run the galleries generator
  console.log('Regenerating website galleries...');
  execSync('node scripts/generate-galleries.mjs', { stdio: 'inherit' });
  
  // 6. Automatically commit and push to Git/Vercel (only if run locally)
  if (!process.env.GITHUB_ACTIONS) {
    console.log('Checking for local changes to push to Git/Vercel...');
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
      if (status) {
        console.log('Changes detected. Staging changes...');
        execSync('git add .');
        
        console.log('Committing changes...');
        execSync('git commit -m "chore: auto-sync portfolio photos"');
        
        console.log('Pushing to remote origin main...');
        execSync('git push origin main');
        console.log('Successfully pushed changes! Vercel deployment triggered.');
      } else {
        console.log('No changes detected in portfolio photos.');
      }
    } catch (gitErr) {
      console.error('Git push failed. Please push changes manually:', gitErr.message);
    }
  } else {
    console.log('Running in GitHub Actions environment. Skipping local git push.');
  }

  console.log('Sync complete!');
}

run().catch(err => {
  console.error('Sync failed:', err);
  process.exitCode = 1;
});
