---
name: Admin Authentication
description: Login against the hopups-server admin API, token storage, and route guarding
targets:
  - ../src/stores/auth.ts
  - ../src/api/client.ts
  - ../src/router/index.ts
  - ../src/views/LoginView.vue
---

# Admin Authentication

The console authenticates against `hopups-server`'s single global admin (`POST /api/admin/login`,
see that project's `admin-api.spec.md`). There are no per-user accounts here — only a stored JWT
that gates every other screen.

```typescript
interface AuthState {
  token: string | null;
  expiresAt: string | null; // ISO 8601
}

function login(username: string, password: string): Promise<void>; // throws on 401
function logout(): void;
function isAuthenticated(): boolean; // token present and not past expiresAt
```

## Login

- Submitting the login form calls `POST {API_BASE_URL}/api/admin/login` with `{ username, password }`.
  `[@test] ../tests/stores/auth-login-success.test.ts`
- On success (`200`), the returned `token` and `expiresAt` are persisted (`localStorage`) and the
  user is redirected to the sites list.
  `[@test] ../tests/views/login-redirects-on-success.test.ts`
- On `401`, the form shows an error message and no token is stored.
  `[@test] ../tests/stores/auth-login-invalid-credentials.test.ts`

## Session persistence and expiry

- `isAuthenticated` returns `false` when no token is stored, or when the current time is past the
  stored `expiresAt`.
  `[@test] ../tests/stores/auth-is-authenticated.test.ts`
- `logout` clears the stored token/expiresAt.
  `[@test] ../tests/stores/auth-logout-clears-token.test.ts`

## API client integration

- Every request the API client makes to a protected admin endpoint attaches
  `Authorization: Bearer <token>` using the currently stored token.
  `[@test] ../tests/api/client-attaches-auth-header.test.ts`
- A `401` response from any API call clears the stored session and redirects to `/login`, so an
  expired or revoked token on the server side is handled the same way as local expiry.
  `[@test] ../tests/api/client-401-clears-session.test.ts`

## Route guarding

- Navigating to any route other than `/login` while `isAuthenticated()` is `false` redirects to
  `/login`.
  `[@test] ../tests/router/guard-redirects-unauthenticated.test.ts`
- Navigating to `/login` while already authenticated redirects to the sites list.
  `[@test] ../tests/router/guard-redirects-authenticated-away-from-login.test.ts`
