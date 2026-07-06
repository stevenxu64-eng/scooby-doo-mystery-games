# Scene Backdrops

**Bundled:** hand-drawn SVG backdrops (`lobby.svg`, `grounds.svg`,
`janitor_closet.svg`, `trap_room.svg`), painted to line up with the hotspot
rectangles in `src/data/scenes.json`.

To swap in pre-rendered 3D or 2D art (Sketchfab / CGTrader / Itch.io), drop
16:9 images here and update each scene's `background_image_url` in
`src/data/scenes.json` to the new filename. If an image fails to load, the
engine falls back to the scene's `fallback_gradient`.
