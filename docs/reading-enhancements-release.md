# Quran reading enhancements

Implementation and validation notes. Deployment status is tracked by the release pull request.

## Reader changes

- Restore Indian Mushaf page, zoom and relative horizontal/vertical reading position after reopening. Existing saved page records remain compatible.
- Remember the large-controls setting on the same browser. Controls and messages support English, Hindi and Urdu.
- Navigate by printed page or any of 30 paras. The map is specific to the pinned 610-page Nasta'liq edition; a para can start within the selected page.
- Download the current original scan or current para, including its shared ending page. Show saved page count, actual stored size, progress, stop and remove controls. Downloads include Mushaf images, not audio or translations.
- Serve explicitly saved images and the reader shell/assets offline. Other API data and pages are not cached. Browser eviction can remove downloads.
- Practise an ayah range on a surah page with 1/2/3/5/10 repetitions per ayah, a 0/3/5/10-second practice pause, range looping, and optional hiding of selected Arabic text. Practice uses the selected reciter and switches listening to Arabic. Stop cancels playback; ordinary Arabic/Urdu playback remains available.

## Validation

Passed locally:

- Production build, type checking and lint.
- Existing complete functional regression suite.
- Mushaf integration: all 114 surah links, all 30 para controls, page limits, retry, fullscreen, zoom, remembered large controls and relative position restoration after viewport resizing.
- Audio integration: existing Arabic/Urdu sequence and error handling, finite practice repetition and cancellation during a practice pause.
- Service-worker tests: offline downloaded scans with retry queries, reader navigation and static assets, honest failure for unsaved pages, exclusion of private and prayer routes.
- Production HTTP smoke test: reader controls render and original scan returns through the image route.

Limit: a real-browser offline/mobile visual test could not run because the browser binary download failed in this environment. Before production release, verify one page download, offline reload, image rendering and memorisation playback on a real mobile browser. Offline audio downloads are not included in this release.

