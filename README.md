
  # Photography Business Website

  This is a code bundle for Photography Business Website. The original project is available at https://www.figma.com/design/K0zmxDH1SeAGJWeoze852E/Photography-Business-Website.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Private Immich Access Page

  The app supports a hidden, passphrase-gated page for your Immich instance.

  Add these values to `.env`:

  - `VITE_IMMICH_URL`: Full URL to your Immich app.
  - `VITE_IMMICH_HIDDEN_PATH`: Secret path segment, for example `/studio-vault-2026`.
  - `VITE_IMMICH_PASSWORD_SHA256`: SHA-256 hash of your passphrase.
  - `VITE_IMMICH_CLIENT_PATH`: Route for client gallery access page, for example `/clients`.

  Generate the SHA-256 hash in your terminal:

  `echo -n "your-passphrase" | shasum -a 256`

  Open your hidden page at:

  `https://your-domain.com/<your-hidden-path>`
  