# Betül Log

A deliberately small personal logbook:

- public, chronological archive
- private mobile capture page
- entries and images stored in your own GitHub repository
- free static hosting on Cloudflare Pages
- a Cloudflare Worker writes new entries into `site/posts.json`

## Architecture

Phone → `/new.html` → Cloudflare Worker → GitHub commit → Cloudflare Pages redeploy

## 1. Create the GitHub repository

Create a repository named `betul-log`, then upload this folder or push it with Git.

Create a fine-grained GitHub token with access only to this repository and **Contents: Read and write** permission.

## 2. Deploy the site to Cloudflare Pages

In Cloudflare Pages:

1. Connect the `betul-log` GitHub repository.
2. Framework preset: **None**.
3. Build command: leave empty.
4. Build output directory: `site`.
5. Deploy.

Your public logbook will be available at the Pages URL.

## 3. Deploy the Worker

Install Node.js, then from the `worker` folder:

```bash
npm install
npx wrangler login
```

Edit `wrangler.toml` and set your GitHub username and repository name.

Create two Worker secrets:

```bash
npx wrangler secret put GITHUB_TOKEN
npx wrangler secret put POSTING_SECRET
```

- `GITHUB_TOKEN`: your fine-grained GitHub token.
- `POSTING_SECRET`: invent a long private password. You will enter it once on your phone.

Deploy:

```bash
npm run deploy
```

Copy the Worker URL.

## 4. Connect the capture page

Edit `site/config.js`:

```js
window.BETUL_LOG_CONFIG = {
  workerUrl: "https://betul-log-api.YOUR-SUBDOMAIN.workers.dev"
};
```

Commit and push. Cloudflare Pages will redeploy.

## 5. Put it on your iPhone

1. Open `https://YOUR-PAGES-URL/new.html` in Safari.
2. Tap Share.
3. Tap **Add to Home Screen**.
4. Open it from the new icon.
5. Enter your posting key once. It stays only in that browser's local storage.

Now the capture flow is:

1. tap icon
2. choose or take photo
3. write one sentence
4. save

## Important limits

This MVP intentionally has:

- no accounts
- no analytics
- no tags
- no search
- no comments
- no AI

The only success metric is whether you actually use it.

## Security note

The capture page is public, but publishing requires the secret Worker key. Use a long random value. The GitHub token is stored only as an encrypted Cloudflare Worker secret and is never sent to the browser.
