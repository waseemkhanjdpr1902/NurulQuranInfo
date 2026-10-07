# Arabic + Urdu audio pilot

Pilot chapters: Al-Fatihah (1), Al-Ikhlas (112), Al-Falaq (113), An-Nas (114): 22 ayahs.

Arabic uses the reader's selected reciter. Urdu streams the existing human recordings from EveryAyah's `translations/urdu_shamshad_ali_khan_46kbps` directory. Filenames use three-digit surah + three-digit local ayah; never the global ayah ID. Source: https://everyayah.com/recitations_ayat.html

The written Urdu remains the existing Fateh Muhammad Jalandhry edition. The recording is separately credited to Shamshad Ali Khan. Confirm the spoken wording matches the displayed edition during listening review.

Arabic only is the default. Arabic + Urdu is available only on the four pilot chapters. Each Arabic clip is followed by its Urdu clip before advancing. Replay and repeat start the entire pair again. Changing modes stops playback. An audio error stops instead of silently omitting Urdu. The paired mode stops at the end of the surah instead of carrying into a chapter outside the pilot.

## Validation completed

- Lint, TypeScript and production build passed locally.
- All 22 filename mappings and pilot boundaries checked.
- Actual React player tested with simulated media events: Arabic then Urdu, pause/resume during Urdu, replay from Arabic, repeating both clips, moving to another ayah during Urdu, switching to Arabic only, error handling and clearing the source.
- EveryAyah directory lists all 22 pilot files; this verifies file inventory, not spoken accuracy or live decoding.

Integration test: install temporary test dependencies with `npm install --no-save --package-lock=false jsdom@26 tsx@4`, then run `node tests/audio-player.integration.mjs`. Media playback is simulated; this is not a live listening test.

## Remaining before release / expansion

- Listen to every pilot recording, especially Al-Fatihah's basmalah and the first ayah of each short surah. Check spoken Urdu against its stated translation and each local ayah number.
- Confirm the source's reuse/streaming terms for this website.
- Test the preview on mobile and desktop with real audio: pause during both segments, replay, next/previous, reciter change, mode change, repeat and end of surah.
- Check visual highlighting and audio load failures on a slow connection.
- Keep the 114-surah expansion separate until the pilot passes listening and browser review.

Direct MP3 requests were blocked by the execution workspace's network access. No claim of live listening accuracy is made. Production has not been changed by this branch.
