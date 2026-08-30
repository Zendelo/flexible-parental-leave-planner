# Cloudflare deployment

This project is a static Vite application and can be deployed with Cloudflare Workers Static Assets.

The repository includes:

- `wrangler.toml`
- `.github/workflows/deploy-cloudflare.yml`

## Option A: GitHub Actions

Create a Cloudflare API token with only the permissions required to deploy the Worker.

In GitHub, open **Settings → Secrets and variables → Actions** and create:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Push to `main`. The workflow will install dependencies, run tests, run TypeScript checking, build the Vite app, and deploy `dist/` to Cloudflare.

## Option B: Cloudflare Git integration

Cloudflare can also build directly from the GitHub repository.

If you use Cloudflare's native Git integration, disable or remove the GitHub Actions deployment workflow to avoid duplicate production deployments.

Typical build settings:

- Build command: `npm run build`
- Output directory: `dist`

Keep the repository's test/type-check CI workflow enabled even if Cloudflare handles deployment.

## Custom domain

After the first successful deployment, attach a custom domain in Cloudflare. Do not use government branding or a domain that could reasonably imply this is an official Fair Work or Australian Government service.

## Privacy reminder

Before adding analytics, session replay, error reporting, or other third-party scripts, verify that they do not capture calculator inputs such as child DOB, leave dates, work patterns, or Section 76 request dates.
