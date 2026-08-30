# Cloudflare deployment

The Flexible Parental Leave Planner is a static Vite application and can be
deployed with Cloudflare Workers Static Assets.

The repository includes:

- `wrangler.toml`
- `.github/workflows/deploy-cloudflare.yml`

## Current workflow behaviour

The deployment workflow always runs the project's tests, TypeScript check, and
production build on pushes to `main`.

If the required Cloudflare secrets are not configured, the workflow now skips
the deployment step cleanly instead of failing the repository's Actions status.

When both secrets are configured, the same workflow deploys the `dist/`
directory using Cloudflare's Wrangler GitHub Action.

## Required GitHub secrets

In GitHub, open:

**Settings -> Secrets and variables -> Actions**

Create:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Use a Cloudflare API token with only the permissions needed to deploy this
Worker. Do not use a Global API Key.

## First deployment

After adding the secrets, either:

1. push a commit to `main`; or
2. open **Actions -> Deploy to Cloudflare -> Run workflow**.

The workflow will:

1. install dependencies with `npm ci`;
2. run `npm test`;
3. run `npx tsc --noEmit`;
4. run `npm run build`;
5. deploy with Wrangler.

## Cloudflare configuration

`wrangler.toml` serves the Vite `dist/` directory as static assets and uses SPA
fallback for client-side routes such as `/terms` and `/privacy`.

## Alternative: Cloudflare Git integration

Cloudflare can also build directly from the GitHub repository.

If you use Cloudflare's native Git integration, disable or remove
`.github/workflows/deploy-cloudflare.yml` so there is only one production
deployment path.

Typical build settings are:

- Build command: `npm run build`
- Output directory: `dist`

Keep `.github/workflows/ci.yml` enabled even if Cloudflare handles deployment.

## Custom domain

After a successful deployment, attach a custom domain in Cloudflare.

Avoid names, branding or visual treatment that could reasonably imply the site
is operated by the Fair Work Ombudsman, Fair Work Commission or Australian
Government.

## Privacy

The calculator is designed to process entered dates and work patterns in the
browser.

Before adding analytics, session replay, error reporting, contact forms or
other third-party scripts, verify that they do not capture calculator inputs
such as:

- child's date of birth;
- leave dates;
- return-to-work dates;
- work patterns; or
- extension-request dates.

If the deployed data flow changes, update the Privacy page before release.
