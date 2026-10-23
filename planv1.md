# CBCC v3 — Remediation Plan v1 (Agile)

**Source:** code scan of `main` @ `92c49ba` (2026-10-23)
**Method:** Scrum-style — prioritized product backlog, 1-week sprints, story points (Fibonacci), MoSCoW priority
**Release gate:** Do **not** deploy to production until Sprint 1 is Done. If the current code is already live, treat Sprint 1 as a hotfix.

---

## 1. Roles & Ceremonies

| Item | Detail |
|---|---|
| Product Owner | Decides role rules (open questions in §7), accepts stories |
| Dev Team | Implements stories, writes tests |
| Sprint length | 1 week (adjust to team capacity) |
| Sprint Planning | Start of sprint — pull top stories from backlog |
| Daily Stand-up | 15 min — yesterday / today / blockers |
| Sprint Review | End of sprint — demo on Vercel preview deployment |
| Retrospective | After review — what to keep / change |

---

## 2. Definition of Ready (a story can enter a sprint when)

- [ ] Acceptance criteria are written and testable
- [ ] Allowed roles for the feature are agreed (see §7)
- [ ] Dependencies on other stories are resolved or scheduled earlier

## 3. Definition of Done (a story is Done when)

- [ ] Code reviewed and merged via PR (no direct pushes to `main`)
- [ ] `npm run lint` shows no **new** errors in changed files
- [ ] `npm run build` passes
- [ ] Verified locally with `vercel dev` (API + frontend together)
- [ ] For API stories: tested with **no token → 401**, **wrong role → 403**, **correct role → 2xx**
- [ ] No secrets or full user objects written to logs
- [ ] Deployed to a Vercel preview and checked by the PO

---

## 4. Epics

| Epic | Name | Goal |
|---|---|---|
| E1 | Lock down server API | Every `/api/*` endpoint verifies the caller's token and role on the server |
| E2 | Data & storage authorization | Supabase RLS and storage policies enforce roles, not just the UI |
| E3 | Data integrity & reliability | No orphaned records, no hung requests, correct error messages |
| E4 | Frontend bugs | Fix visible UI defects |
| E5 | Dependencies & build | Patch vulnerable packages, reduce bundle size |
| E6 | Code quality | Clean lint, remove debug logging, consistent patterns |
| E7 | Dev environment & docs | Anyone can clone, configure and run the full app |
| E8 | Testing | Automated tests protect the security fixes from regressing |
| E9 | UI consistency & feedback | Every admin/elder panel looks and behaves the same; users always see what happened (toasts) |

---

## 5. Product Backlog

Priority: **M** = Must, **S** = Should, **C** = Could. Severity is from the scan.

| ID | Epic | Story | Severity | Pri | Pts | Sprint |
|---|---|---|---|---|---|---|
| CBCC-01 | E1 | Shared `requireRole()` auth helper for API | Critical | M | 3 | 1 |
| CBCC-02 | E1 | Secure `update-user` (anyone can become Super Admin) | Critical | M | 2 | 1 |
| CBCC-03 | E1 | Secure `users` (full user list is public) | Critical | M | 1 | 1 |
| CBCC-04 | E1 | Secure `delete-user` (trusts requester ID from body) | Critical | M | 2 | 1 |
| CBCC-05 | E1 | Secure `elder-update` (no auth, can delete any storage file) | Critical | M | 3 | 1 |
| CBCC-06 | E1 | Secure `announce-create` (token sent but ignored) | Critical | M | 1 | 1 |
| CBCC-07 | E1 | Role + ownership checks on `elder-delete` / `elder-upload` / `elder-select` | High | M | 3 | 1 |
| CBCC-08 | E1 | Post-fix audit of users and roles for tampering | High | M | 2 | 1 |
| CBCC-09 | E2 | Audit and fix Supabase RLS on all content tables | High | M | 5 | 2 |
| CBCC-10 | E2 | Storage bucket policies for `cbcc-bucket` | High | M | 3 | 2 |
| CBCC-11 | E2 | Make elder files private (signed URLs) | High | M | 5 | 2 |
| CBCC-12 | E2 | Validate `role` values on register/update | Medium | M | 1 | 2 |
| CBCC-13 | E2 | Validate and sanitize uploads (type, size, filename) | Medium | S | 2 | 2 |
| CBCC-14 | E2 | Stop leaking internal error messages to clients | Low | S | 2 | 2 |
| CBCC-15 | E3 | Fix `res.json()` → `res.text()` fallback (body already used) | Medium | M | 2 | 3 |
| CBCC-16 | E3 | Fix `elder-upload` hanging on errors inside form callback | Medium | M | 2 | 3 |
| CBCC-17 | E3 | Fix elder file replace failing above ~3.3 MB | Medium | M | 3 | 3 |
| CBCC-18 | E3 | Roll back partial writes in `register` / `delete-user` | Medium | S | 2 | 3 |
| CBCC-19 | E3 | Add HTTP method check to `me.js` and remove user logging | Low | S | 1 | 3 |
| CBCC-20 | E3 | Handle missing `FRONTEND_URL` in `forgot-password` | Low | S | 1 | 3 |
| CBCC-21 | E4 | Livestream player restarts on every re-render | Medium | M | 2 | 3 |
| CBCC-22 | E4 | Duplicate `Radio` icon key | Low | S | 1 | 3 |
| CBCC-23 | E4 | Hard-coded `isLive = true` in LiveService | Low | C | 2 | 4 |
| CBCC-24 | E4 | Default role `"Viewer"` doesn't exist in UI role list | Low | S | 1 | 3 |
| CBCC-25 | E5 | Patch vulnerable dependencies (`npm audit fix`) | High | M | 2 | 2 |
| CBCC-26 | E5 | Plan Tailwind v3 → v4 upgrade (remaining audit items) | Low | C | 5 | 4 |
| CBCC-27 | E5 | Code-split the 604 kB main bundle | Low | C | 3 | 4 |
| CBCC-28 | E6 | ESLint: add Node globals for `api/` | Low | S | 1 | 4 |
| CBCC-29 | E6 | Remove unused imports/variables (~150 errors) | Low | S | 3 | 4 |
| CBCC-30 | E6 | Fix React-hooks lint errors (~15) | Low | S | 3 | 4 |
| CBCC-31 | E6 | Remove debug `console.log` calls | Low | S | 1 | 4 |
| CBCC-32 | E7 | Stop tracking `.env`; move config to Vercel env | Low | M | 1 | 1 |
| CBCC-33 | E7 | Document local setup (`vercel dev`, required env vars) | Low | S | 2 | 2 |
| CBCC-34 | E7 | Align `.nvmrc` with supported Node version | Low | C | 1 | 4 |
| CBCC-35 | E8 | Set up Vitest + API handler auth tests | Medium | S | 5 | 2 |
| CBCC-36 | E4 | Elder files list breaks after saving (found in Sprint 1) | Medium | M | 1 | 5 |
| CBCC-37 | E9 | Site-wide toast notifications | Medium | M | 3 | 5 |
| CBCC-38 | E9 | Replace `alert()` and silent failures with toasts; success toasts on save/delete | Medium | M | 3 | 5 |
| CBCC-39 | E9 | Consistent saving/deleting states (no double submits) | Medium | M | 3 | 5 |
| CBCC-40 | E9 | Consistent loading and empty states | Low | M | 2 | 5 |
| CBCC-41 | E9 | Shared design tokens; remove off-palette colors | Low | S | 2 | 5 |
| CBCC-42 | E9 | Unify media-card panels (Activities, Weekly Devotion, Elder Files) | Low | S | 3 | 5 |
| CBCC-43 | E9 | Copy fixes (wrong modal titles and messages) | Low | M | 1 | 5 |
| CBCC-44 | E2 | Third-party chatbot script runs on admin/elder pages (found in Sprint 5) | Medium | M | 2 | 2 |

**Total: 99 points** across 5 sprints.

---

## 6. Sprint Plan

### Sprint 1 — "Close the doors" (Critical security) · 18 pts
**Sprint goal:** No `/api/*` endpoint can be used without a valid token and the correct role.

CBCC-01, 02, 03, 04, 05, 06, 07, 08, 32

### Sprint 2 — "Defense in depth" (RLS, storage, deps, tests) · 29 pts
**Sprint goal:** Database and storage enforce roles even if someone bypasses the API; dependencies patched; auth fixes covered by tests.

CBCC-09, 10, 11, 12, 13, 14, 25, 33, 35, 44

### Sprint 3 — "Reliability" (Bugs) · 15 pts
**Sprint goal:** Uploads, user management and the livestream work reliably with correct error messages.

CBCC-15, 16, 17, 18, 19, 20, 21, 22, 24

### Sprint 4 — "Clean up" (Code quality & performance) · 19 pts
**Sprint goal:** Lint is clean, bundle is split, upgrade path is planned.

CBCC-23, 26, 27, 28, 29, 30, 31, 34

### Sprint 5 — "One look, clear feedback" (UI consistency) · 18 pts
**Sprint goal:** Every admin and elder panel uses the same building blocks and states, and every action tells the user whether it worked.
*Pulled forward by the PO on 2026-10-23, ahead of Sprints 2–4. Sprint 2 (database security rules) is still the recommended next security sprint.*

CBCC-36, 37, 38, 39, 40, 41, 42, 43

---

## 7. Open Questions for the Product Owner (resolve before Sprint 1 planning)

| # | Question | Affects |
|---|---|---|
| Q1 | Who may **edit/delete** an elder file — only its uploader, or any Elder, or Super Admin only? | CBCC-05, 07 |
| Q2 | Who may see **all** elder files (`?mode=all`) — Super Admin only, or every Elder? | CBCC-07 |
| Q3 | Which roles may manage announcements, devotions, livestream, activities, weekly service — Super Admin + Editor? | CBCC-06, 09 |
| Q4 | Is the `Viewer` role still needed? The admin UI only offers Editor / Elder / Super Admin. | CBCC-12, 24 |
| Q5 | Is the current code already deployed to production? If yes, Sprint 1 is a hotfix and CBCC-08 is urgent. | Sprint 1 |

Working assumption until answered:

| Area | Allowed roles |
|---|---|
| User management (`users`, `register`, `update-user`, `delete-user`) | Super Admin |
| Site content (announcements, devotions, livestream, activities, weekly service) | Super Admin, Editor |
| Elder files — upload / view own | Super Admin, Elder |
| Elder files — edit / delete | Owner or Super Admin |
| Elder files — view all | Super Admin, Elder *(revised in Sprint 1: the Elders panel defaults to the shared "All" view, so restricting it would break the panel)* |
| Public reads (announcements, devotions, etc.) | Everyone |

---

## 8. Story Details

### E1 — Lock down server API

> **Sprint 1 status (2026-10-23):** CBCC-01 to 07 are code complete on branch `sprint-1/api-auth` and pass a 37-check smoke test (no token → 401, wrong role / not owner → 403, allowed role → 2xx). Remaining before Done: PR review, Vercel preview check, production deploy. CBCC-08 script is ready in `docs/sprint-1-audit.md` and runs after deploy.
> Line references in E1 point to the original scanned code (`92c49ba`).

#### CBCC-01 · Shared `requireRole()` auth helper · 3 pts · ✅ code complete
> As a developer, I want one helper that authenticates and authorizes API requests so every endpoint enforces security the same way.

- [x] New `api/_lib/auth.js` exporting `requireRole(req, res, allowedRoles)`
- [x] Reads `Authorization: Bearer <token>`; returns **401** if missing or invalid (`supabase.auth.getUser(token)`)
- [x] Looks up `userTB` by `auth_id = user.id`; returns **403** if not found or role not allowed
- [x] Returns `{ authUser, dbUser }` on success
- [x] Requester identity always comes from the token — **never** from the request body
- [ ] Files under `api/_lib/` are not exposed as endpoints (underscore prefix) — confirm on Vercel preview that `/api/_lib/auth` returns 404

#### CBCC-02 · Secure `update-user` · 2 pts — `api/update-user.js:13` · ✅ code complete
> As the church, I want only a Super Admin to change names and roles, so nobody can promote themselves.

- [x] Uses `requireRole(..., ["Super Admin"])`
- [x] Client `updateUser()` in `src/api/auth.js:67` sends the bearer token
- [x] A Super Admin cannot demote themselves if they are the last Super Admin (prevents lock-out)
- [x] Unauthenticated `PUT` → 401; Editor/Elder → 403

#### CBCC-03 · Secure `users` · 1 pt — `api/users.js:10` · ✅ code complete
> As a member, I want my email and role hidden from the public.

- [x] Uses `requireRole(..., ["Super Admin"])`
- [x] Selects explicit columns instead of `*`
- [x] Client `fetchUsers()` in `src/api/auth.js:123` sends the bearer token

#### CBCC-04 · Secure `delete-user` · 2 pts — `api/delete-user.js:14` · ✅ code complete
> As the church, I want only a real, logged-in Super Admin to delete accounts.

- [x] Uses `requireRole(..., ["Super Admin"])`; `requester_auth_id` removed from body and from `src/api/auth.js:96`
- [x] A Super Admin cannot delete their own account
- [x] Unauthenticated `DELETE` → 401 even if a valid Super Admin `auth_id` is supplied

#### CBCC-05 · Secure `elder-update` · 3 pts — `api/elder/elder-update.js:13` · ✅ code complete
> As an elder, I want only authorized people to change or remove my files.

- [x] Uses `requireRole(..., ["Super Admin", "Elder"])` + ownership check (per Q1)
- [x] `old_file_path` is **ignored from the client**; the old path is read from the DB row for that `id`
- [x] Client `src/api/elder/update.js` sends the bearer token
- [x] Cannot delete arbitrary storage objects by passing a path
- [x] *(added)* Old file is removed only after the new upload and DB update succeed, so a failed upload no longer loses the existing file

#### CBCC-06 · Secure `announce-create` · 1 pt — `api/announce/announce-create.js:16` · ✅ code complete
- [x] Uses `requireRole(..., ["Super Admin", "Editor"])`
- [x] Unauthenticated `POST` → 401

#### CBCC-07 · Role + ownership on elder endpoints · 3 pts · ✅ code complete
Files: `api/elder/elder-delete.js`, `elder-upload.js`, `elder-select.js`
- [x] All three use `requireRole(..., ["Super Admin", "Elder"])`
- [x] `elder-delete`: only owner or Super Admin (per Q1)
- [x] `elder-select?mode=all`: allowed for Elder + Super Admin (see revised Q2 assumption); any unknown `mode` value now falls back to `mine`
- [x] Editor or other roles → 403
- [x] *(added)* `register.js` switched to the shared helper for consistency

#### CBCC-08 · Post-fix tampering audit · 2 pts · ⏳ ready to run after deploy
> As the PO, I want to know whether anyone abused the open endpoints before they were closed.

Script and checklist: `docs/sprint-1-audit.md` (read-only SQL for the Supabase SQL Editor + Vercel log checklist).

- [ ] List all `userTB` rows with role `Super Admin` / `Editor` / `Elder` and confirm each is legitimate
- [ ] Compare `userTB` against Supabase Auth users (look for missing or unexpected accounts)
- [ ] Review recent announcements and elder files for unexpected entries
- [ ] Check storage for deleted or unreferenced files
- [ ] Check Vercel function logs for calls to `update-user`, `delete-user`, `elder-update`, `announce-create` from unknown sources
- [ ] Findings recorded; any rogue accounts removed

---

### E2 — Data & storage authorization

#### CBCC-09 · Audit and fix Supabase RLS · 5 pts
The browser writes directly to these tables with the public key, so RLS is the only protection:
`announce_tb`, `bible_verses`, `livestream_tb`, `recent_activities`, `weekly_devotion_tb`, `weekservice_tb`, `userTB`, `elder-storage_tb`

- [ ] RLS **enabled** on every table above
- [ ] Public (`anon`) can only `SELECT` public content tables
- [ ] `INSERT/UPDATE/DELETE` on content tables allowed only when the caller's `userTB.role` is Super Admin or Editor (e.g. via a `security definer` function `current_role()`)
- [ ] `userTB` and `elder-storage_tb` have **no** anon access
- [ ] Policies saved as SQL migration files in the repo (e.g. `supabase/migrations/`) so they are reviewable
- [ ] Tested: logged-out user and Elder account cannot modify site content

#### CBCC-10 · Storage policies for `cbcc-bucket` · 3 pts
- [ ] Upload/delete under `recent-act-files/` and `devotion-files/` restricted to Super Admin / Editor
- [ ] `elder-files/` not writable from the browser (server-only via service role)
- [ ] Anonymous users cannot list or delete objects
- [ ] Policies saved as migration SQL

#### CBCC-11 · Make elder files private · 5 pts — `api/elder/elder-upload.js:74`
> As an elder, I want my files viewable only by logged-in, authorized users.

- [ ] Elder files moved to a **private** bucket (or private folder with policies)
- [ ] `elder-select` returns short-lived **signed URLs** instead of stored public URLs
- [ ] `file_url` no longer stored as a permanent public link
- [ ] Existing files migrated; old public links stop working

#### CBCC-12 · Validate role values · 1 pt
- [ ] `register.js` and `update-user.js` reject any role not in the allowed list (constant shared with `AdminPanel.jsx:32`)
- [ ] Return 400 on invalid role

#### CBCC-13 · Validate and sanitize uploads · 2 pts
Files: `api/elder/elder-upload.js:52`, `api/elder/elder-update.js:61`, `src/api/recentActivity/*`, `src/api/weeklydevotion/*`
- [ ] Allow-list MIME types per feature (images for activities; PDF/images for devotions and elder files)
- [ ] Max size enforced (formidable `maxFileSize`, client-side check too)
- [ ] `originalFilename` sanitized (strip `/`, `\`, `..`, control chars) before building the storage path

#### CBCC-14 · Stop leaking internal errors · 2 pts
- [ ] API responses return generic messages; full error logged server-side only
- [ ] Applies to all `api/*` handlers that return `error.message` / `err.message`

---

#### CBCC-44 · Keep the third-party chatbot off admin/elder pages · 2 pts — `index.html:56`
> As an admin, I don't want an outside script running on pages where I'm logged in.

`https://www.tuqlas.com/chatbot.js` is loaded from `index.html`, so it runs on every page, including `/cbccadmin` and `/cbccelders`. The Supabase session is kept in `localStorage` (`src/lib/supabaseClient.js`), which any script on the page can read — if the vendor were compromised, admin sessions could be stolen.
- [ ] Load the chatbot only on public routes (inject it from the public layout instead of `index.html`), or remove it
- [ ] Confirm it no longer loads on `/cbccadmin`, `/cbccelders` or `/reset-password`
- [ ] Consider a Content-Security-Policy header in `vercel.json` limiting script sources

---

### E3 — Data integrity & reliability

#### CBCC-15 · Fix response body double-read · 2 pts
Files: `src/api/announce/create.js`, `src/api/announce/read.js`, `src/api/elder/select.js`, `src/api/elder/delete.js`, `src/api/elder/upload.js`
- [ ] Read body once with `res.text()`, then `JSON.parse` in a try/catch (pattern already used in `src/api/auth.js`)
- [ ] Real server error message shown to the user instead of "body already used"
- [ ] Consider extracting a shared `apiFetch()` helper

#### CBCC-16 · Fix `elder-upload` hang · 2 pts — `api/elder/elder-upload.js:39`
- [ ] Replace callback `form.parse(req, cb)` with the promise form so the outer `try/catch` covers it
- [ ] Any thrown error returns a 500 response instead of hanging until timeout

#### CBCC-17 · Fix large elder file replacement · 3 pts — `api/elder/elder-update.js`
- [ ] Stop sending files as base64 JSON (Vercel request limit 4.5 MB)
- [ ] Use multipart (same as upload) or a signed upload URL straight to storage
- [ ] Files up to the agreed max size (CBCC-13) can be replaced

#### CBCC-18 · Roll back partial writes · 2 pts
- [ ] `register.js:37`: if `userTB` insert fails, delete the just-created auth user
- [ ] `delete-user.js:31`: delete the auth user first (or restore the row on failure) so the two never drift — confirmed in the Sprint 1 smoke test: when the auth delete fails, the `userTB` row is already gone

#### CBCC-19 · Harden `me.js` · 1 pt — `api/me.js`
- [ ] Only `GET` allowed (405 otherwise)
- [ ] Remove `console.log(user)` at line 40

#### CBCC-20 · `forgot-password` env guard · 1 pt — `api/forgot-password.js:21`
- [ ] If `FRONTEND_URL` is missing, return 500 with a clear log message instead of sending `undefined/reset-password` links

---

### E4 — Frontend bugs

#### CBCC-21 · Livestream player restarts · 2 pts — `src/components/cbccupdates/LiveService.jsx:62`
- [ ] Move `Player` outside `LiveService` (pass props), so the iframe isn't recreated on every render
- [ ] Stream keeps playing when unrelated state changes

#### CBCC-22 · Duplicate `Radio` icon · 1 pt — `src/assets/svg/Icon.jsx:50, 369`
- [ ] Keep one definition (or rename the second); confirm the intended icon renders where used

#### CBCC-23 · Real live status · 2 pts — `LiveService.jsx:15`
- [ ] Replace hard-coded `isLive = true` with a value from `livestream_tb` (e.g. `is_live` flag or schedule)

#### CBCC-24 · Default role mismatch · 1 pt — `api/register.js:20`
- [ ] Default role matches a role the UI understands (per Q4), or remove the default and require one

#### CBCC-36 · Elder files list breaks after saving · 1 pt — `src/components/elders/ElderFiles.jsx:133` · ✅ code complete (Sprint 5)
> As an elder, I want the file list to stay correct after I upload or edit a file.

`refreshData()` reloads with the default `mode=mine` and skips `formatFiles()`, so after any save the list loses previews, file names and "uploaded by", and the **All** view shows only the user's own files.
- [x] `refreshData()` uses the current `filter` and passes results through `formatFiles()`
- [x] After upload/edit in **All** view, other elders' files are still listed with previews

---

### E5 — Dependencies & build

#### CBCC-25 · Patch vulnerable dependencies · 2 pts
- [ ] Run `npm audit fix` (**without** `--force`)
- [ ] `react-router` / `react-router-dom` patched (ships to browsers — highest real impact)
- [ ] `vite`, `postcss`, `@babel/core`, `nanoid`, `qs`, etc. patched
- [ ] App smoke-tested after upgrade; remaining items limited to the Tailwind chain

#### CBCC-26 · Tailwind v4 upgrade plan · 5 pts
- [ ] Spike: estimate effort to migrate `tailwind.config.js` / `postcss.config.js` to v4
- [ ] Clears remaining `braces` / `micromatch` / `chokidar` advisories (build-time only)

#### CBCC-27 · Code-split main bundle · 3 pts
- [ ] Main chunk under 500 kB (currently 604 kB)
- [ ] Admin and Elders panels lazy-loaded; large libs (e.g. `framer-motion`) split if needed

---

### E6 — Code quality

#### CBCC-28 · ESLint Node globals for `api/` · 1 pt — `eslint.config.js`
- [ ] Add an override for `api/**` with `globals.node` (clears `process` / `Buffer` no-undef errors)

#### CBCC-29 · Remove unused imports/variables · 3 pts
- [ ] ~150 `no-unused-vars` errors fixed (mostly unused `React`, icons, UI components)

#### CBCC-30 · Fix React-hooks errors · 3 pts
Files: `Navbar.jsx:44`, `AnnouncementPanel.jsx:104`, `DevotionPanel.jsx:43`, `LivePanel.jsx:76`, `Announcements.jsx:44`, `DailyDevotion.jsx:39,76,96,115`, `CBCCDevotion.jsx:90,155`
- [ ] Functions declared before use in effects
- [ ] Synchronous `setState` in effects replaced with derived state or event handlers

#### CBCC-31 · Remove debug logging · 1 pt
- [ ] Remove `console.log` in `read-public.js`, `recentActivity/delete.js`, `recentActivity/update.js`, `weeklydevotion/delete.js`, `weeklydevotion/update.js`, `AnnouncementPanel.jsx`, `Announcements.jsx`, `LoginModal.jsx`, `SuperAdminModal.jsx`, `CBCCDevotion.jsx`

---

### E7 — Dev environment & docs

#### CBCC-32 · Stop tracking `.env` · 1 pt · ✅ code complete
- [x] `git rm --cached .env`; add `.env` to `.gitignore`
- [x] Add `.env.example` listing variable names only
- [x] Confirm production values live in Vercel project settings (all 6 vars set; `SUPABASE_ANON_KEY` corrected from a service-role JWT to the publishable key; `FRONTEND_URL` trailing slash removed)
- [x] *(added)* Secret key rotated on 2026-10-23: new `sb_secret_` key in Vercel + local `.env`, old key deleted and confirmed rejected. Only the public key was ever committed; no secret key found in git history.
- [ ] *(optional)* Disable legacy JWT-based API keys in Supabase once no Vercel variable starts with `eyJ`

#### CBCC-33 · Local setup docs · 2 pts — `README.md`
- [ ] Explain `npm run dev` serves only the frontend; use `npm run dev:full` (added in Sprint 5: `vercel dev` with `vercel.dev.json`, because the SPA rewrite in `vercel.json` breaks Vite's dev modules under plain `vercel dev`)
- [ ] List required env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `FRONTEND_URL`
- [ ] Explain `vercel link` + `vercel env pull`

#### CBCC-34 · Align `.nvmrc` · 1 pt
- [ ] Set to a version Vite 8 supports and Vercel uses (e.g. `22`); add `"engines"` to `package.json`

---

### E8 — Testing

#### CBCC-35 · API auth tests · 5 pts
- [ ] Add Vitest
- [ ] Tests for every `api/*` handler: no token → 401, wrong role → 403, allowed role → success (Supabase client mocked)
- [ ] Tests for `requireRole()` helper
- [ ] `npm test` script added; run in CI (GitHub Actions) on every PR

---

### E9 — UI consistency & feedback

> **Sprint 5 status (2026-10-23):** CBCC-36 to 43 code complete on `sprint-5/ui-consistency`; build passes; lint errors in touched files down from 32 to 19. Home page verified rendering with no console errors via `npm run dev:full`. Remaining before Done: PO tests the panels while logged in, then PR + deploy.

#### CBCC-37 · Site-wide toast notifications · 3 pts
> As a user, I want a short, non-blocking message after every action so I know whether it worked.

- [x] `ToastProvider` wraps the app; `useToast()` exposes `success`, `error`, `info`
- [x] Brand styling (navy text, aqua = success, red = error, steel = info), stacked top-right, full-width on phones
- [x] Auto-dismiss (errors stay longer) with a close button; screen readers announce them (`aria-live`)
- [x] Shows above modals

#### CBCC-38 · Toasts instead of `alert()` and silent failures · 3 pts
- [x] All 12 `alert()` calls replaced (Admin, Announcement, Weekly Devotion, Elder Files, Reset Password)
- [x] Panels that only `console.error` on failure (Live, Service, Devotion, Activities) now show an error toast
- [x] Success toast on every create, update and delete; on login and logout
- [x] Forgot-password success no longer shown in the red error style

#### CBCC-39 · Consistent saving/deleting states · 3 pts
- [x] `ModalFooter` supports `loading` (spinner + "Saving…", buttons disabled) — `ActivitiesPanel` and `AdminPanel` already passed it but it was ignored
- [x] `ConfirmDelete` supports `loading` ("Deleting…", can't close mid-delete)
- [x] All 8 panels use both, so Save/Delete can't be double-clicked into duplicate requests

#### CBCC-40 · Consistent loading and empty states · 2 pts
- [x] Shared `LoadingState` shown while each panel loads
- [x] `EmptyState` supports `title` / `subtitle` / `icon` — Weekly Devotion and Elder Files passed these but rendered a blank box
- [x] Activities panel gets an empty state

#### CBCC-41 · Shared design tokens · 2 pts
- [x] `src/lib/theme.js` with brand colors and fonts for inline-styled components
- [x] Off-palette colors in admin/elder panels (`#38B2AC`, `#805AD5`, `#4A5568`, `#D1D5DB`, `#c7d76f`…) replaced with brand tokens

#### CBCC-42 · Unify media-card panels · 3 pts
- [x] Card action buttons use shared `btnStyles.overlay` / `overlayDanger` in Activities, Weekly Devotion and Elder Files
- [x] Weekly Devotion and Elder Files use `ModalFooter` instead of their own unstyled buttons
- [x] Elder Files All/Mine filter matches the shared tab style
- [x] Admin Users table action buttons spaced like every other table

#### CBCC-43 · Copy fixes · 1 pt
- [x] Announcement modal says "Add/Edit Announcement" (was "Add/Edit Devotion"); validation no longer says "Bible title"
- [x] Debug `console.log` calls removed from the panels touched

---

## 9. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Code is already live with open endpoints | Accounts or content may already be tampered with | Treat Sprint 1 as hotfix; run CBCC-08 immediately after |
| Tightening RLS breaks admin panels that write from the browser | Editors can't save content | Test each panel on a Vercel preview with Editor and Elder accounts before merging CBCC-09 |
| Making elder files private breaks existing links | Old links stop working | Communicate to elders; signed URLs generated on demand |
| No existing tests | Regressions go unnoticed | CBCC-35 in Sprint 2, before the bug-fix sprint |

---

## 10. Progress Tracker

| Sprint | Planned pts | Done pts | Status |
|---|---|---|---|
| 1 | 18 | 16 | Deployed to production 2026-10-23 (PR #1). CBCC-08 audit run; waiting on PO to confirm Super Admin accounts |
| 2 | 29 | 0 | Not started |
| 3 | 15 | 0 | Not started |
| 4 | 19 | 0 | Not started |
| 5 | 18 | 0 | In progress on `sprint-5/ui-consistency` |
