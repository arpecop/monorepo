# Cloudflare Pages Deployment Guide

## Prerequisites

1. Install Cloudflare Wrangler CLI globally (if not already installed):
```bash
yarn global add wrangler
# or
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

## Deployment Methods

### Method 1: Manual Deployment (Recommended for first time)

1. Build the project for Cloudflare Pages:
```bash
yarn pages:build
```

2. Deploy to Cloudflare Pages:
```bash
yarn pages:deploy
```

3. Follow the prompts to create a new project or select an existing one.

### Method 2: Connect GitHub Repository (Automatic Deployments)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** → **Pages**
3. Click **Create a project** → **Connect to Git**
4. Select your repository
5. Configure build settings:
   - **Framework preset**: Next.js
   - **Build command**: `yarn pages:build`
   - **Build output directory**: `.vercel/output/static`
   - **Root directory**: `articles` (if in monorepo)
   - **Node version**: `20`

6. Add environment variables (if needed):
   - `NEXT_PUBLIC_GRAPHQL_ENDPOINT`: Your Hasura GraphQL endpoint

7. Click **Save and Deploy**

## Environment Variables

Make sure to set up these environment variables in Cloudflare:

- `NEXT_PUBLIC_GRAPHQL_ENDPOINT`: Your Hasura GraphQL API endpoint

## Local Development with Cloudflare Workers

Test your app locally with Cloudflare's environment:

```bash
# Build first
yarn pages:build

# Then run locally
yarn pages:dev
```

## Important Notes

1. **Node.js Compatibility**: The app uses Node.js APIs, so Cloudflare compatibility flags are set automatically.

2. **Apollo Client**: The app uses Apollo Client for GraphQL queries. Make sure your Hasura endpoint is accessible from Cloudflare's network.

3. **Limitations**: 
   - Cloudflare Workers/Pages have different runtime than Node.js
   - Some Node.js APIs might not be available
   - Check [Cloudflare's Node.js compatibility](https://developers.cloudflare.com/workers/runtime-apis/nodejs/) for details

4. **Build Output**: The `@cloudflare/next-on-pages` adapter converts your Next.js app to work on Cloudflare's edge network.

## Troubleshooting

### Build Fails

- Make sure all dependencies are installed: `yarn install`
- Check Next.js version compatibility with `@cloudflare/next-on-pages`
- Review build logs for specific errors

### API Routes Not Working

- Ensure `nodejs_compat` flag is enabled
- Check if your API routes use Node.js APIs that aren't supported

### Environment Variables Not Working

- Prefix browser-accessible variables with `NEXT_PUBLIC_`
- Set them in Cloudflare Dashboard under Pages settings

## Useful Commands

```bash
# Build for Cloudflare
yarn pages:build

# Deploy to Cloudflare
yarn pages:deploy

# Local development with Cloudflare runtime
yarn pages:dev

# Watch mode (rebuild on changes)
yarn pages:watch

# Regular Next.js dev server
yarn dev
```

## Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [@cloudflare/next-on-pages](https://github.com/cloudflare/next-on-pages)
