# NurulQuran functional audit — 15 October 2026

## Scope and evidence

Inspected the live website, repository routes, components, service worker, and quality workflow. HTTP availability is not proof that every interaction works. This is a first functional audit, not a certification of all 114 surahs, all Mushaf scans, all translations, account synchronization, or every device.

Live availability: 200 responses for /, /quran, /mushaf, /prayer-times, /dua, /tasbih, /names-of-allah, /zakat, /quran-reflection, /quran-topics, /quran-reading-plan, /my-quran-journey, /bookmarks, /hadith, /tafseer, /islamic-science, /spiritual-guide, /dawah, /login, /signup, /dashboard, /sources, /manifest.json and /sw.js.

Live interaction evidence:
- Indo-Pak original page image loaded; next-page control changed printed page 2 to 3; zoom changed 100% to 125%.
- Fatiha rendered seven ayahs. Written Urdu selection displayed Jalandhry text.
- Actual audio element was playing with readyState 4 and advancing time; reader progressed through ayahs and displayed Arabic/Urdu phases. Pause worked.
- English and Urdu Ibn Kathir content loaded for 1:1 with source labels.
- AI Dawah returned a response to a test question about 18:10.

## Local fixes prepared

| Area | Defect | Change |
| --- | --- | --- |
| Quality checks | Four hook warnings fail zero-warning lint | Correct dependencies and stabilize GPS update callbacks with a once-per-mount guard |
| Dashboard | Invented reading totals, donation amount, course progress, streak, activity; inactive navigation | Reuse actual Quran journey dashboard |
| Dua | Copy, share and favourite controls have no handlers; unhandled audio rejection | Clipboard and native sharing/fallback; local favourites; audio cleanup and visible failure; disclose synthesized audio |
| Tasbih | Every main-container click increments, including navigation; lifetime resets on reload | Explicit keyboard-accessible count button, reset label, versioned local persistence |
| Hadith | Search only first 50 despite fetching entire collection; grading scholar mislabelled as narrator; inactive save | Search all fetched records with 20-item incremental rendering; correct grading attribution; local save and feedback; cancel stale requests |
| Tafsir page | Dead /#ai destination; advertises editions unavailable in reader | Link to working AI companion; list actual English/Urdu/Hindi resources |
| Zakat | Hardcoded example prices labelled current; positive due below Nisab; no holding-condition control; dead payment button | User-entered prices, selected gold/silver basis, explicit holding-condition confirmation, zero estimate until criteria met; remove payment claim; currency-neutral labels, nonnegative inputs |
| AI companion | Sends no previous turns; request can hang; error loses question; unnamed send button | Recent conversation history, 30s timeout, restored input and error notice, accessible label |
| Names | Excessive mobile card padding and 10px meanings | Smaller mobile padding and readable meaning text |
| Quran navigation | Unnamed header arrow links | Accessible previous/next labels |
| Bookmarks | Empty-state instructions refer to removed reader controls | Correct the empty-state guidance; preserve existing saved data |

## Validation

- npm run lint: pass, zero warnings.
- npm run typecheck: pass.
- Production build: passed for primary fix set; rerun for final follow-up changes.
- npm test: audio component sequencing and failure handling; interface language/error paths; seven prayer-time boundary tests; study-answer validation; new tool interaction regressions all passed.
- Existing prayer tests now run with the project's tsx loader without requiring an undocumented module environment variable.
- Quality workflow now includes functional regression tests before build.

## Remaining work and limits

1. Offline: current service worker has no fetch handler or asset/content cache. Full offline Quran, tafsir, translations and recitation are not implemented. Requires explicit downloads, cache/version/storage management and airplane-mode tests; audio requires careful storage limits.
2. Localization: several secondary tool pages remain English. The global language selector does not translate all content.
3. Accounts: OAuth/email login completion, sign-out, recovery and cross-device synchronization require an authenticated test account. Page availability alone does not validate authentication.
4. Real devices: Android/iOS installation, installed-app prompt suppression, background notifications, permission denial, mobile fullscreen and orientation still need device testing. Browser notification registration alone does not provide scheduled push while the app is closed.
5. Dua audio relies on a third-party synthesized-speech endpoint; it is not a verified human recitation service. The library currently has only two duas. Error handling does not establish reliable audio availability.
6. Saved hadiths are device-local and do not yet have a unified saved-items dashboard or account sync.
7. No exhaustive editorial verification of the 610 Mushaf scans, all ayah audio pairs, published tafsir texts or every hadith grade was performed.
8. Prayer city search, Qibla/compass, reading plans, reflection saves, all topic links, meditation timer, all calculator scenarios and signed-in journeys still require individual end-to-end verification.

## Release state

Changes are local on fix/functional-audit-oct15. An attempt to publish the branch was rejected by automatic approval review: the audit/fix request was not considered explicit authorization to publish code to the public GitHub remote. No production release has been completed. Obtain explicit approval before publishing this branch, then validate a preview before any production merge/release.
