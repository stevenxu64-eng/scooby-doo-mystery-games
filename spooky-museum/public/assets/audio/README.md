# Audio

Resolved by `src/engine/audio.ts`. For each name the game tries `<name>.mp3`
first, then falls back to `<name>.wav`. **Bundled:** procedurally generated
`.wav` files for every sound below — drop in `.mp3`s from Freesound.org with
the same names and they take precedence automatically.

**Loops:** `ambience_museum` (drone), `chase` (pursuit loop)
**One-shots:** `click`, `pickup`, `door`, `solve`, `caught`, `error`, `hide`
