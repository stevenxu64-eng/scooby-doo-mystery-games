# Scooby-Doo: Night at the Spooky Museum

An isometric, grid-based stealth escape room built with React 19, Vite, Tailwind CSS v4,
Zustand, lucide-react, and a raw HTML5 `<canvas>` renderer. Evade the patrolling Mummy,
gather three clues, solve two mechanical puzzles, and unmask the culprit on the case board.

```bash
npm install
npm run dev      # http://localhost:5174
npm run build    # type-check + production build
```

## How to play

- **Move**: WASD / arrow keys (grid steps) or **click a tile** to auto-path (A*).
- **Interact**: walk next to a golden `?` object and press **E** (or click it).
- **Hide**: stand on a pulsing **green diamond** (info desk, sarcophagi). While hidden the
  Mummy cannot see you — even point-blank.
- **Doors**: walk onto a **cyan diamond**. The Archives needs the brass key; the main
  entrance is chained until the mystery is solved.
- **The Mummy**: patrols the red-dotted route in the Grand Hall and Egypt Wing. If it has
  line of sight to you within range, it **chases** (A* pursuit, `!` above its head, chase
  audio). Break line of sight or hide for ~2 seconds and it gives up; get caught and it's
  game over (progress is kept on retry). You get a short "unnoticed" grace window after
  entering a room.
- **Case Board** (**C**): click a clue, then the suspect it implicates. Pin all three on
  one suspect to enable UNMASK. Accuse wisely.

<details>
<summary><b>Walkthrough (spoilers!)</b></summary>

1. **Dinosaur Hall** (west, safe): boots behind the T-Rex → clue; supply crate → brass key.
2. **Egypt Wing** (east): read the hieroglyph plaque, then set the sarcophagus dials to
   **Eye, Scarab, Eye** → glow paint clue. Use the sarcophagi to dodge the Mummy.
3. **Archives** (north, brass key): flip the 2nd and 4th mirrors so the beam runs
   right → down → right into the film sensor → gambling IOU clue.
4. Open the **Case Board**, link all three clues to **Burt Grimsley**, and unmask him.

</details>

## Architecture

```
src/
├── types/game.ts               # Tile codes, room/door/interactive defs, AI + mode types
├── data/
│   ├── maps.json               # 4 rooms: grids (0 floor · 1 wall · 2 interactive ·
│   │                           #   3 hiding · 4 door), spawns, patrols, doors, palettes
│   └── mystery.ts              # Clues, suspects, items, the guilty party
├── utils/                      # Pure math — no canvas, no React
│   ├── iso.ts                  # Isometric projection + inverse + centering + depth sort
│   ├── pathfinding.ts          # A* (binary heap, 4-dir, Manhattan) + neighbor helpers
│   └── los.ts                  # Bresenham line-of-sight (walls & tall objects block)
├── engine/
│   ├── monsterAI.ts            # PATROL → CHASE → RETURN state machine on A* paths
│   ├── render.ts               # Canvas drawing: floors, iso-cube walls, entities,
│   │                           #   sprite-or-geometric-fallback, vignette, fps
│   ├── sprites.ts              # PNG loader w/ silent fallback (/public/assets/tiles/)
│   ├── audio.ts                # Ambience/chase loops + sfx (/public/assets/audio/)
│   └── input.ts                # Keyboard state singleton
├── store/gameStore.ts          # Zustand: playerPosition, monsterPosition, activeRoomId,
│                               #   inventory, foundClues, gameMode + the tick() logic
└── components/
    ├── GameCanvas.tsx          # rAF loop, click/hover → inverse projection, key bindings
    ├── PuzzleOverlay.tsx       # Symbol-dial + light-beam mirror puzzles
    ├── UnmaskingBoard.tsx      # Clue→suspect connection board with SVG link lines
    ├── HUD.tsx                 # Sidebar (objective, clues, items, case-board button)
    └── Overlays.tsx            # Caught / Mystery Solved screens
```

### Swapping in real assets

- **Tiles/sprites**: drop Kenney.nl isometric PNGs into `public/assets/tiles/`
  (`floor.png`, `wall.png`, `player.png`, `monster.png`, ... — see the README there).
  Missing files automatically fall back to the geometric renderer.
- **Audio**: drop `.mp3`s into `public/assets/audio/` (`ambience_museum.mp3`,
  `chase.mp3`, `pickup.mp3`, ...). Missing files fail silently.
- **New rooms**: add a node to `maps.json` — grid, doors, patrol route, palette — and
  it's playable with zero code changes.

Note: the game loop runs on `requestAnimationFrame`, so the browser auto-pauses the
game when the tab is hidden.
