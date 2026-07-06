# Tile & Sprite Textures

Load order per sprite: `<name>.png` → `<name>.svg` → geometric canvas fallback.
**Bundled:** hand-drawn SVGs for `player` (Scooby), `monster` (the Mummy),
`hiding` (open sarcophagus), and `interactive` (exhibit crate). Walls, floors,
and doors intentionally use the palette-driven geometric renderer so each room
keeps its own color identity.

To use Kenney.nl kit art (Isometric Spooky / Graveyard), drop PNGs here — they
override the SVGs automatically:

- `floor.png` — 64x32 floor diamond
- `wall.png` — 64x~74 wall block (bottom-anchored)
- `hiding.png` — 64x48 hiding spot
- `interactive.png` — 64x56 interactive object
- `player.png` — 64x72 (feet at bottom-center)
- `monster.png` — 64x84 (feet at bottom-center)
