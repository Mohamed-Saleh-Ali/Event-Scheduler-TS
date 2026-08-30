# 🛠️ TS Refactor — Presentation Guide

> Module Project: TS Refactor Event Scheduler · Chapter 8
> Scope per the course brief: **FR-TS01** (configure TS tool-chain) + **FR-TS02** (progressively type
> components/hooks/utilities, small PRs, kill implicit `any`). No new features.

---

## 1. What actually happened before the refactor (context for the "why")

Worth saying out loud in the presentation: the fork used for this refactor (`dev` branch) was stuck at the
very first merge — planning + boilerplate only, none of the group's actual work (auth, events, navbar,
create-event...). That work only existed on the upstream repo (`BMU6/Event-Scheduler-Groupe3`). First step
was syncing the fork to upstream `dev` (`git merge --ff-only upstream/dev`) before any TS work could start —
otherwise the "refactor" would've been refactoring an empty scaffold.

## 2. Branch layout (mirrors FR004 — small PRs, one topic each)

| Branch | Touches | What it does |
|---|---|---|
| `feat/ts-toolchain` | root configs | tsconfig(.app/.node).json, vite.config.ts, eslint.config.js → typescript-eslint, `index.html` → `main.tsx`, `build` script runs `tsc -b` first |
| `feat/ts-shared-utils` | `src/types/`, `src/utils/api.ts`, `src/network/Fetches.ts` | shared types + the two data-access modules |
| `feat/ts-context-and-components` | `AuthContext`, `Layout`, `Navbar`, `EventCard` | typed context value + removes 3 dead files (see §4) |
| `feat/ts-pages` | `pages/Home`, `pages/EventDetails`, `pages/CreateEvent` | typed state, typed form values, `catch` narrowing |
| `feat/ts-auth-forms-and-app` | `SignInForm`, `SignUpForm`, `App`, `main` | typed form state/errors, `App.tsx`/`main.tsx` |

Each branch only touches its own files, so they merge into `dev` cleanly **in any order** — push and open
5 small PRs the same way the group already works, per FR004. `integration/ts-full` is a local-only branch
with all five merged, just to verify the whole app together (`tsc -b`, `vite build`, `eslint .` all pass
clean on it) — don't push that one, it's not part of the PR history.

## 3. The FR-TS02 talking points — pick 3-4 of these for the live walkthrough

**Generic `request<T>()` instead of `any` fetch responses** (`utils/api.ts`)
```ts
async function request<T>(path: string, options: RequestInit = {}): Promise<T> { ... }

export function getEvents({ page = 1, limit = 50 } = {}) {
  return request<PaginatedEvents>(`/events?page=${page}&limit=${limit}`)
}
```
Every caller of `getEvents()` now gets `PaginatedEvents` back, autocompleted — `data.results` is a real
`EventItem[]`, not "whatever fetch gave us."

**Discriminated union for API errors, with a type guard** (`types/index.ts` + `Fetches.ts`)
```ts
export type ApiErrorKind = 'network' | 'technical' | 'unauthorized' | 'validation' | 'conflict' | 'unknown'
export interface ApiError { kind: ApiErrorKind; status?: number; message: string }

export function isApiError(err: unknown): err is ApiError {
  return typeof err === 'object' && err !== null && 'kind' in err && 'message' in err
}
```
`SignIn`/`SignUp` throw plain objects, not `Error` instances (deliberate — that's how the switch-on-`kind`
error handling in the forms works). In strict TS, a `catch` binding is `unknown`, not `any`, so the forms
have to prove the shape before touching `err.kind`:
```ts
} catch (err) {
  if (!isApiError(err)) { setAuthError('Something went wrong.'); return }
  switch (err.kind) { case 'unauthorized': ...
```

**`catch` narrowing on plain `Error`s** — every page (`Home`, `EventDetails`, `CreateEvent`) does this:
```ts
} catch (err) {
  setError(err instanceof Error ? err.message : 'Something went wrong.')
}
```
Same reason: `unknown`, not `any`. This is the single most repeated diff across the whole PR set — good
one to point at when asked "where did you actually remove an implicit `any`?".

**Removed the last real `any`s from `Fetches.ts`**
`safeJson()` used to return `Promise<any>`, and `buildError()` took `body: any`. Now `safeJson` returns
`unknown`, and a small `readMessage(body: unknown): string | undefined` helper narrows it before reading
`.message`/`.error` off it. `npx eslint .` enforces `@typescript-eslint/no-explicit-any`, which is what
caught these two — worth mentioning that lint, not just `tsc`, was part of catching implicit `any`.

**React event types instead of untyped `(e)`**
```ts
const handleChange = (e: ChangeEvent<HTMLInputElement>) => { ... }
const handleSubmit = (e: FormEvent<HTMLFormElement>) => { ... }
```
Used in `CreateEvent`, `SignInForm`, `SignUpForm`.

## 4. Dead code removed (call this out proactively — it looks like scope creep otherwise)

Three files were left over from the group's un-merged auth branches and were never reachable from
`App.jsx`'s routes:

- `src/Home.jsx` — fully commented out, no `export default` at all.
- `src/components/Navbar.jsx` — a duplicate of the real `Navbar.jsx`, but reading a `useAuth()` shape
  (`isAuthenticated` / `user` / `logout`) that the actual `AuthContext` never provided.
- `src/layout/ProtectedLayout.jsx` — same mismatched shape, unused; `CreateEvent` guards itself inline
  with `isLoggedIn()` from `utils/api` instead.

Converting these to TS as-is was not possible — they don't compile against the real `AuthContext`. The
alternative (inventing a new context shape to make them type-check) would've been a **new feature**, which
is explicitly out of scope for this sprint. Deleting unreachable code that was never part of the running
app is not a feature change — nothing about the app's behavior changes. If asked "why fewer files than
before" this is the answer.

## 5. Live demo script (~5–7 min)

1. `git log --oneline dev..integration/ts-full` — show the 5 commits / PR-sized diffs.
2. `npx tsc -b` — clean, no errors. Then deliberately break something to show the compiler catching it:
   e.g. in `EventCard.tsx` write `event.titel` (typo) → `tsc -b` fails immediately. Undo it.
3. `npm run build` — full production build (`tsc -b && vite build`) succeeds, ships `dist/`.
4. `npx eslint .` — clean (0 errors after the two `no-explicit-any` fixes in `Fetches.ts` and the
   `react-refresh` fix in `AuthContext.tsx`).
5. `npm run dev`, click through: Home → event card → EventDetails → SignIn → SignUp → CreateEvent
   (redirect when logged out, works when logged in) — same behavior as before, nothing changed
   user-facing, which is the point of a pure refactor.

## 6. Likely instructor questions

- **"Why not `any` here?"** → point at strict `tsconfig.app.json` (`strict: true`, `noUnusedLocals`,
  `noUnusedParameters`) and the `@typescript-eslint/no-explicit-any` rule — both fail the build/lint if
  `any` sneaks back in.
- **"Why is `ProtectedLayout` gone instead of typed?"** → §4 above — it was dead, mismatched code, not a
  feature.
- **"Did behavior change anywhere?"** → No — same routes, same components rendered, same API calls.
  `npm run build` output is functionally identical; the diff is entirely types + file extensions + the 3
  dead files.
- **"What's still loosely typed?"** → `signUp()`/`login()`/`getProfile()` in `utils/api.ts` don't pass an
  explicit `<T>` to `request()` yet (inferred as the JSON shape but not pinned to an interface) — an
  honest "next PR" answer if pushed on it.

## 7. Push checklist (do this from your own machine, not this session)

```bash
git push -u origin feat/ts-toolchain
git push -u origin feat/ts-shared-utils
git push -u origin feat/ts-context-and-components
git push -u origin feat/ts-pages
git push -u origin feat/ts-auth-forms-and-app
```
Open 5 PRs into `dev`, in that order (`feat/ts-toolchain` first — the others assume `tsconfig`/`vite.config.ts`
exist for the build script to work, even though the diffs themselves don't conflict). Merge, then `git pull`
on `dev` and delete the branches.
