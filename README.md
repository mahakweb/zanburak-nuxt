# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Authentication

The Nuxt website uses Laravel Sanctum's first-party session authentication.
The Laravel session cookie is HttpOnly; Nuxt forwards the incoming cookie for
SSR API requests and sends credentials plus the XSRF token for browser API calls.
`GET /api/user` returns `204 No Content` when there is no active session, so
guest session restoration does not produce an expected `401` in the browser console.
Native applications continue to use Sanctum personal access tokens with the
`Authorization: Bearer <token>` header.

Configure `NUXT_PUBLIC_APP_URL` to the canonical website origin and
`NUXT_PUBLIC_API_BASE_URL` to the backend API base (normally ending in `/api`).
The backend must include the website host in `SANCTUM_STATEFUL_DOMAINS` and
`CORS_ALLOWED_ORIGINS`, and in production use `SESSION_DOMAIN=.zanburak.ir`,
`SESSION_SECURE_COOKIE=true`, and `SESSION_SAME_SITE=lax`. Set those values
for the actual deployed domains before enabling website session login.
