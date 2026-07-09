import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    
    // Custom dev middleware to simulate the /api/gallery Vercel serverless function locally
    {
      name: 'local-api-proxy',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
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

              // Load URL from env or use default
              const immichUrl = process.env.VITE_IMMICH_URL || "https://photos.avainframe.com";

              let resolvedKey = token;
              let albumId = "";
              let albumName = "Client Gallery";

              // 1. Try to resolve as a slug first (e.g. "beth")
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

              // 2. If it wasn't a slug, validate as direct key
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

              // 3. Fetch album assets using the resolved key
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
                  assets: albumData.assets || [],
                  shareKey: resolvedKey, // send the resolved key back so the client can load images
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
