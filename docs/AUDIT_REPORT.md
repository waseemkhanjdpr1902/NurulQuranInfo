# NurulQuran.info Project Audit

Audit date: 2026-06-18

## Scope

Reviewed the Next.js App Router project, shared components, API routes, public PWA assets, auth/payment integrations, and major Islamic feature pages. Quran recitation behavior was reviewed for boundaries and intentionally not rewritten.

## Findings

### 1. Broken pages and missing routes

- Footer linked to missing routes: `/hajj`, `/privacy`, `/terms`, `/support`, `/feedback`.
- There was no first-party `not-found.tsx`, so invalid Surah slugs fell through to a generic Next.js 404.
- No `/admin` route existed for content management.

### 2. Components not rendering or rendering incomplete content

- `/names-of-allah` advertised 99 names but rendered only 12.
- `/dua` rendered only two duas and lacked categories/search despite imported category icons.
- `/dashboard` returned `null` while auth was loading, creating a blank screen.

### 3. Buttons or links that did nothing

- Navbar search icon had no handler.
- Footer social links used `href="#"`.
- Footer newsletter submit icon had no handler.
- Home "Support our Mission" button had no action.
- Dua copy/share/favorite buttons were decorative.
- Hadith bookmark/share controls were decorative.
- Prayer notification buttons were not wired.
- Several marketing CTA buttons on static pages were placeholders.

### 4. Missing routes/features

- No dedicated Islamic calendar, daily verse, daily hadith, or notification-management routes were present.
- No global search or recently viewed foundation existed.
- No working admin panel existed.
- PWA manifest existed, but used remote placeholder icons and no service worker registration.

### 5. API failures and integration risks

- Client-side Gemini usage exposed `NEXT_PUBLIC_GEMINI_API_KEY` in `AIAssistant`, `HadithCard`, and `dawah`.
- `/api/payment` accepted arbitrary amounts without auth or bounds.
- `/auth/callback` trusted the `next` parameter too broadly.
- `/dashboard` was protected only by client-side redirect.
- Third-party Quran/hadith/prayer APIs had limited user-facing fallback states.

### 6. Console/build risks

- Linting is ignored during production builds in `next.config.js`.
- Several pages/components used broad `any` types and direct browser APIs that need careful QA.
- Remote Google OAuth avatars were not allowlisted in `next/image`.

### 7. Performance bottlenecks

- Many pages are client components even when mostly static.
- Quran, hadith, prayer, and tafsir data are fetched from third parties at runtime.
- Motion-heavy UI does not yet fully honor reduced-motion preferences.
- No route-level loading/error boundaries existed before this pass.

### 8. Duplicate code / maintainability

- Similar glass-card/search/action-button patterns are repeated across feature pages.
- Auth redirect checks were duplicated between middleware and client dashboard logic.
- AI calls had multiple client implementations instead of one server-side API boundary.

### 9. Accessibility issues

- Icon-only buttons often lacked `aria-label`.
- Mobile menu lacked `aria-expanded`.
- Modal focus management and Escape-key handling remain incomplete.
- Search inputs and controls needed better labels.

### 10. SEO issues

- Root metadata was generic.
- No sitemap/robots route existed.
- Surah pages had no dynamic metadata.
- No custom 404 page existed.

### 11. Mobile responsiveness problems

- Quran verse controls were initially hidden behind hover on desktop; mobile controls were visible, but needed clearer affordance.
- Fixed navbar, audio player, AI button, and popups can compete for viewport space.
- Tasbih counted clicks anywhere on the page, including navbar/footer taps.

## Priority TODO

### P0 - Security and production trust

1. Remove all client-side Gemini key usage. **Done in this increment.**
2. Protect dashboard/admin routes in middleware. **Done in this increment.**
3. Sanitize auth callback redirects. **Done in this increment.**
4. Require auth and validate payment amounts. **Done in this increment.**
5. Remove footer 404s and dead links. **Done in this increment.**

### P1 - Core broken UX

6. Complete Names of Allah with all 99 names, search, audio, copy/share, favorites. **Done in this increment.**
7. Fix Tasbih accidental page-wide counting and persist count/history. **Done in this increment.**
8. Add Dua search/categories/transliteration/copy/share/favorites. **Done in this increment.**
9. Improve Prayer Times next-prayer state, countdown, manual city parsing, Qibla errors. **Done in this increment.**
10. Add Quran in-Surah search, reading preferences, continue reading, error state, share fallback. **Done in this increment without changing recitation.**

### P2 - Product completeness

11. Add real Daily Verse and Daily Hadith modules with favorites/share.
12. Add Islamic Calendar route with Hijri/Gregorian dates and important events.
13. Add persistent Quran bookmarks and reading progress backed by the chosen production data store.
14. Add notification permission workflow and scheduled local reminders.
15. Replace local admin drafts with production admin tables and role checks.
16. Add multilingual content structure and translation files.

### P3 - SEO, accessibility, and performance

17. Convert static marketing pages to server components where possible.
18. Add route-specific metadata across all public routes.
19. Add modal focus traps and Escape-key handling.
20. Add reduced-motion support for heavy animations.
21. Add automated route/component smoke tests and Lighthouse CI.
22. Re-enable lint checks during builds after existing lint debt is cleaned up.

## First increment summary

This pass stabilized high-risk security paths, fixed the most visible broken feature pages, added missing footer routes, introduced basic PWA/offline support, and created foundations for global search, recent pages, continue reading, reading preferences, and admin content management.

Quran recitation reciter IDs, audio URL construction, playback sequencing, and the shared audio player were intentionally preserved.
