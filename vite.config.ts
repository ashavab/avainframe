import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    
    // Custom dev middleware to simulate Vercel serverless functions locally
    {
      name: 'local-api-proxy',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          // 1. Handle selection submission
          if (req.url && req.url.startsWith('/api/select-photos')) {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const { assetIds } = JSON.parse(body);
                if (!assetIds || !Array.isArray(assetIds) || assetIds.length === 0) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Missing or invalid assetIds' }));
                  return;
                }

                // Load config using loadEnv in development
                const env = loadEnv(server.config.mode, process.cwd(), '');
                const immichUrl = env.VITE_IMMICH_URL || "https://photos.avainframe.com";
                const apiKey = env.IMMICH_API_KEY || env.VITE_IMMICH_API_KEY;

                if (!apiKey) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Local API Key (IMMICH_API_KEY) not configured in .env' }));
                  return;
                }

                const updateRes = await fetch(`${immichUrl}/api/assets`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey
                  },
                  body: JSON.stringify({
                    ids: assetIds,
                    description: 'Selected' // Set description to "Selected" (no dot) to keep watermarked until approved
                  })
                });

                if (!updateRes.ok) {
                  const errorText = await updateRes.text();
                  res.statusCode = updateRes.status;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: `Immich update failed: ${errorText}` }));
                  return;
                }

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
              }
            });
            return;
          }

          // 1.5. Handle download all
          if (req.url && req.url.startsWith('/api/download-all')) {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const { assetIds, shareKey } = JSON.parse(body);
                if (!assetIds || !Array.isArray(assetIds) || assetIds.length === 0) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Missing or invalid assetIds' }));
                  return;
                }

                // Load config using loadEnv in development
                const env = loadEnv(server.config.mode, process.cwd(), '');
                const immichUrl = env.VITE_IMMICH_URL || "https://photos.avainframe.com";

                // 1. Prepare download info
                const infoRes = await fetch(`${immichUrl}/api/download/info`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-immich-share-key': shareKey || ""
                  },
                  body: JSON.stringify({
                    ids: assetIds
                  })
                });

                if (!infoRes.ok) {
                  const errorText = await infoRes.text();
                  res.statusCode = infoRes.status;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: `Failed to prepare download: ${errorText}` }));
                  return;
                }

                // 2. Fetch the actual ZIP archive
                const archiveRes = await fetch(`${immichUrl}/api/download/archive`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-immich-share-key': shareKey || ""
                  },
                  body: JSON.stringify({
                    ids: assetIds
                  })
                });

                if (!archiveRes.ok) {
                  const errorText = await archiveRes.text();
                  res.statusCode = archiveRes.status;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: `Failed to get download archive: ${errorText}` }));
                  return;
                }

                // Send the zip back to the client
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/zip');
                res.setHeader('Content-Disposition', 'attachment; filename="photos.zip"');
                
                // Get buffer and send
                const arrayBuffer = await archiveRes.arrayBuffer();
                res.end(Buffer.from(arrayBuffer));
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
              }
            });
            return;
          }

          // 2. Handle gallery data retrieval
          if (req.url && req.url.startsWith('/api/gallery')) {
            try {
              const url = new URL(req.url, 'http://localhost');
              const token = url.searchParams.get('token');

              if (!token) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Missing token parameter' }));
                return;
              }

              // Load URL from env
              const env = loadEnv(server.config.mode, process.cwd(), '');
              const immichUrl = env.VITE_IMMICH_URL || "https://photos.avainframe.com";

              let resolvedKey = token;
              let albumId = "";
              let albumName = "Client Gallery";

              // Try to resolve as a slug first (e.g. "beth")
              try {
                const slugRes = await fetch(`${immichUrl}/api/shared-links/me?slug=${token}`);
                if (slugRes.ok) {
                  const slugData = await slugRes.json();
                  if (slugData.key && slugData.album?.id) {
                    resolvedKey = slugData.key;
                    albumId = slugData.album.id;
                    albumName = slugData.album.albumName || albumName;
                  }
                }
              } catch (slugErr) {
                console.warn("Failed to resolve slug, proceeding as direct key:", slugErr);
              }

              // If it wasn't a slug, validate as direct key
              if (!albumId) {
                const meRes = await fetch(`${immichUrl}/api/shared-links/me`, {
                  headers: { "x-immich-share-key": token },
                });

                if (!meRes.ok) {
                  res.statusCode = meRes.status;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: `Immich auth failed: Status ${meRes.status}` }));
                  return;
                }

                const sharedLink = await meRes.json();
                albumId = sharedLink.album?.id;
                albumName = sharedLink.album?.albumName || albumName;
              }

              if (!albumId) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Shared link does not point to an album' }));
                return;
              }

              // Fetch album assets using the resolved key
              const albumRes = await fetch(`${immichUrl}/api/albums/${albumId}`, {
                headers: { "x-immich-share-key": resolvedKey },
              });

              if (!albumRes.ok) {
                res.statusCode = albumRes.status;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: `Immich album fetch failed: Status ${albumRes.status}` }));
                return;
              }

              const albumData = await albumRes.json();
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  albumName: albumData.albumName || albumName,
                  albumDescription: albumData.description || "",
                  assets: albumData.assets || [],
                  shareKey: resolvedKey,
                })
              );
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
            }
            return;
          }
          next();
        });
      }
    }
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
