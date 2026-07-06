# Audio

Resolved by `src/engine/audio.ts`. For each name the game tries `<name>.mp3`
first, then falls back to `<name>.wav`. **Bundled:** procedurally generated
`.wav` files for every sound below — drop in higher-quality `.mp3`s from
Freesound.org with the same names and they take precedence automatically.

**UI / SFX (one-shots):**
`click`, `pickup`, `unlock`, `rattle`, `trap`, `error`, `combine`, `switch`

**Ambience (loops, one per scene):**
`ambience_lobby`, `ambience_grounds`, `ambience_closet`, `ambience_boiler`
