# Kontenin

**Belajar bikin konten. Praktik. Dapat feedback. Berkembang.**

Kontenin is an AI-powered learning and content-creation platform for beginner-to-intermediate Indonesian content creators. Its core value: **personalized learning + practical missions + AI feedback on your own content.**

```
Diagnosis → Dashboard → Learn → Practice → Create → AI Feedback → Improve → Progress → Next mission
```

It runs fully in **Demo Mode** with no API keys: every AI result is produced by a transparent, rule-based demo engine and is clearly labeled **“Demo data”**. Add keys and the same UI switches to real providers, labeled **“Real AI · OpenAI/Gemini/WayinVideo”**.

---

## Features

| Area | Routes | What works |
| --- | --- | --- |
| Landing | `/` | 14 sections, interactive hero preview, live in-browser hook scorer |
| Auth | `/login` `/register` `/forgot-password` | Supabase auth, or signed-cookie local auth + one-click demo account |
| Onboarding | `/onboarding` | 5-step creator diagnosis → Creator Profile + starting plan |
| Dashboard | `/dashboard` | Level/XP, today's mission, continue learning, streak, stats, activity, planner preview |
| Learn | `/learn`, `/learn/[courseId]`, `/learn/[courseId]/[lessonId]` | 12 courses (12 categories), search + filters, ordered lesson unlocking, transcript/takeaways/examples, graded quiz, practice task, +XP |
| Missions | `/missions`, `/missions/[missionId]` | 14 practical missions, AI evaluation, improved rewrite, private in-browser recorder, completion + XP |
| Create | `/create` + `ideas` `hooks` `script` `caption` `brief` `repurpose` `analyze` | 7 AI tools, save/regenerate/copy, idea → script → analyzer handoff, add-to-planner, library |
| AI Studio | `/ai-studio` + `analyze` `moments` `clips` `transcript` `captions` `reframe` | Upload/URL/sample, staged processing, content score, moment search with seeking, clips (preview/edit/save/export cut list), searchable transcript + quotes + summary, caption styling with **.srt export**, reframe preview |
| Planner | `/planner` | Month/week calendar, create/edit/delete, drag-and-drop reschedule with undo, status filters |
| Analytics | `/analytics` | KPIs with period deltas, 4 Recharts charts, per-video breakdown, computed insights |
| Progress | `/progress` | Level journey, stats, 9 achievements, XP history |
| Profile / Settings | `/profile`, `/settings` | Editable profile, 7 settings tabs, theme, data export, progress reset |

### Honest by design
- Results show **Demo data** vs **Real AI** badges everywhere (`components/shared/source-badge.tsx`).
- AI Studio in Demo Mode uses a **sample transcript**, scaled to your file's real duration, and says so on every screen. Your file stays in the browser for preview.
- Face tracking and auto-crop say plainly that they aren't running without a provider.
- Clip "Export" downloads a real timestamp cut list (.txt); captions export a real `.srt`. Kontenin doesn't render video, by design.
- Analytics are labeled as a fixed demo dataset, and insights are **computed** from it (no invented percentages).
- Landing-page testimonials are marked as illustrative placeholders; replace them with quotes from your user testing.

---

## Tech stack

- **Next.js 16** (App Router, Turbopack, Cache Components, `proxy.ts`), **React 19**, **TypeScript (strict)**
- **Tailwind CSS v4**, **shadcn/ui** (Base UI primitives), **Lucide** icons, **Motion** (Framer Motion)
- **Zustand** (persisted client state), **Zod** (validation for inputs *and* AI outputs)
- **Recharts** (lazy-loaded), **Sonner** toasts, **next-themes**
- **Supabase** (`@supabase/ssr`) ready; **OpenAI / Gemini / WayinVideo** server-side adapters

## Project structure

```
app/
  (marketing)/page.tsx         landing
  (auth)/                      login, register, forgot-password
  onboarding/                  creator diagnosis
  (app)/                       authenticated app (sidebar layout)
  actions/                     server actions: auth.ts, ai.ts
  api/video/*                  server routes: upload, analyze, clips, moments, transcript, summary
  api/auth/signout             clears stale sessions
components/
  layout/ dashboard/ learning/ missions/ create/ ai-studio/ planner/ analytics/ progress/ profile/ settings/ shared/ ui/
lib/
  ai/        ai.service.ts (facade) · mock-ai.service.ts · openai.service.ts · gemini.service.ts · llm-base.service.ts · schemas.ts · heuristics.ts
  video/     video.service.ts · mock-video.service.ts · wayinvideo.service.ts · demo-transcript.ts
  auth/      session.ts · mock-auth.ts
  supabase/  server.ts · client.ts · config.ts
  data/      courses, missions, analytics, gamification, onboarding (seed content)
  store/     app-store.ts (user progress) · video-store.ts · player-store.ts
types/       database.ts (Supabase rows) · domain.ts
supabase/    schema.sql (tables + RLS + signup trigger)
proxy.ts     optimistic auth gate
```

---

## Getting started

Requirements: **Node.js 20.9+** (tested on Node 24).

```bash
npm install
cp .env.example .env.local   # optional, the app works without it
npm run dev
```

Open http://localhost:3000 and either click **Continue with demo account** or log in with:

- Email: `demo@kontenin.id`
- Password: `demo123`

The demo account comes with seeded progress (Level 3, 2,450 XP, 7-day streak). New registrations start fresh and go through onboarding.

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build (includes type-checking) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type-check only (run `npx next typegen` first after adding routes) |

---

## Environment variables

See `.env.example`. All are optional.

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | public | Absolute URL for metadata and auth redirects |
| `AUTH_SECRET` | server | HMAC key for local session cookies. **Set in production.** |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | Enables Supabase auth |
| `SUPABASE_SERVICE_ROLE_KEY` | server | Reserved for admin/seed scripts. Never expose. |
| `AI_PROVIDER` | server | Force `openai`, `gemini`, or `demo` |
| `OPENAI_API_KEY`, `OPENAI_MODEL` | server | OpenAI adapter |
| `GEMINI_API_KEY`, `GEMINI_MODEL` | server | Gemini adapter |
| `WAYINVIDEO_API_KEY`, `WAYINVIDEO_API_BASE_URL` | server | WayinVideo adapter |

Secret keys are only read in `server-only` modules (`lib/ai/*`, `lib/video/*`, `lib/auth/*`) and reach the browser only as provider *names*, never values.

## Supabase setup

1. Create a project at supabase.com and copy the URL and anon key into `.env.local`.
2. Open **SQL Editor** and run `supabase/schema.sql`. It creates 19 tables, row-level security (users only see their own rows), and a trigger that creates a `public.users` row on signup.
3. In **Authentication → Providers**, enable Email. For the one-click demo login, create a user `demo@kontenin.id` / `demo123`.
4. Restart `npm run dev`. Login, register, and password reset now go through Supabase.

> **Current scope:** with Supabase enabled, *authentication* is real. Learning progress, saved items, and planner data are still kept in the browser via the persisted Zustand store (`lib/store/app-store.ts`). The schema and `types/database.ts` are ready. Swapping store actions for Supabase queries is the next backend step.

## AI setup

Set `OPENAI_API_KEY` **or** `GEMINI_API_KEY`. `lib/ai/ai.service.ts` picks the provider (or honors `AI_PROVIDER`).

- All prompts live in `lib/ai/llm-base.service.ts` and ask for strict JSON.
- Responses are validated with the Zod schemas in `lib/ai/schemas.ts`. Malformed output becomes a clear error, never broken UI.
- Performance insights stay computed (`computePerformanceInsight`) even with a real model, so percentages are never invented.
- To add a provider, extend `LLMService` and implement `completeJSON()`.

## WayinVideo API setup

`lib/video/wayinvideo.service.ts` is a **server-side integration scaffold**. Set `WAYINVIDEO_API_KEY` (and `WAYINVIDEO_API_BASE_URL`) to route `/api/video/*` through it.

> ⚠️ The endpoint paths and response shapes in the wrapper are placeholders. Confirm them against WayinVideo's official API reference and adjust the paths and schemas before relying on it. Responses are Zod-validated, so mismatches surface as errors rather than wrong data.

The browser never calls WayinVideo directly. Every call goes through `app/api/video/*` route handlers, which check the session first.

## Production build

```bash
npm run build
npm start
```

## Deploying to Vercel

1. Push the repository to GitHub and import it in Vercel (framework preset: Next.js).
2. Add environment variables from the table above. At minimum set `AUTH_SECRET` and `NEXT_PUBLIC_APP_URL`.
3. Deploy. Without AI keys the deployment runs in Demo Mode, which is good for showcases.
4. For large video uploads with a real provider, prefer URL import or direct-to-storage uploads (Supabase Storage), since serverless request bodies are size-limited.

---

## Notes for developers

- **Next.js 16 specifics:** `params`/`searchParams` are Promises; middleware is `proxy.ts`; Cache Components is on, so session reads live inside `<Suspense>` in `app/(app)/layout.tsx`.
- **State hydration:** the persisted store uses `skipHydration`. `SessionProvider` rehydrates it after mount, then `initForUser()` scopes data to the signed-in user. `StoreGate` prevents a flash of another user's data.
- **Deterministic demo data:** `lib/seed.ts` (FNV hash + Mulberry32). The same input always gives the same output.
- **Accessibility:** semantic landmarks, skip link, labeled inputs, keyboard-navigable choice groups and command palette (Ctrl/⌘ K), visible focus rings, `prefers-reduced-motion` respected.
