# Scooby-Doo: The Curse of the Abandoned Resort

A first-person, screen-by-screen point-and-click mystery in the style of the classic
Nancy Drew PC games — built with React 19, Vite, Tailwind CSS v4, Zustand, and lucide-react.

This repo holds **two games**: this one at the root, and
[spooky-museum/](spooky-museum/) (an isometric stealth escape room).

```bash
npm install
npm run dev         # http://localhost:5173
npm run build       # type-check + production build
npm run build:site  # build BOTH games + launcher into dist-site/ (see Hosting)
```

## Hosting the website

`npm run build:site` assembles a fully static site in `dist-site/`
(install deps in both projects first: `npm install && npm install --prefix spooky-museum`):

```
dist-site/
├── index.html   # launcher landing page linking both episodes
├── resort/      # Episode 1 — this game
└── museum/      # Episode 2 — the isometric museum game
```

Upload the **contents of `dist-site/`** to any static host — no server code, no
database, ~5 MB total:

- **Netlify / Vercel / Cloudflare Pages**: drag-and-drop the folder, or point the
  build command at `npm run build:site` with publish directory `dist-site`.
- **GitHub Pages**: push `dist-site/` to a `gh-pages` branch (or use an action).
  Both games are built with a *relative* base, so they work from a project
  subpath (`user.github.io/repo/`) as well as a root domain.
- **Any web server (nginx, Apache, S3...)**: copy the folder into the web root.

To test the exact deployed bundle locally:
`python3 -m http.server 4173 -d dist-site` → http://localhost:4173

Note: the consoles will show a few 404s per page load — that's the asset
fallback chain probing for optional overrides (`.mp3` before `.wav`, `.png`
before `.svg`) and is harmless.

## How to play

The game opens with an animated intro: George Palm III's letter hires Mystery Inc., and the
Mystery Machine rolls up to the abandoned Grand Palm Resort ("Skip intro" any time; it
replays on a fresh game).


- **Move** between screens with the on-screen arrows, or **Arrows/WASD** (Q/E for up/down).
- **Click hotspots** to examine, collect, and talk. Press **H** to outline all hotspots.
- **Inventory**: click an item to arm it, then click a hotspot to use it — or click a
  *second* item to try combining them (e.g. Long Stick + Chewing Gum).
- **Walkie-talkie**: switch between Fred / Daphne / Velma / Shaggy & Scooby. Some obstacles
  only yield to the right gang member (Fred rigs traps and moves heavy things, Velma reads
  documents, Shaggy & Scooby handle snacks and bait, Daphne picks locks). **Stuck? Flip
  through the walkie** — whoever you switch to calls out what they'd try in the current room,
  until their job there is done.
- **Dialogue**: click a branch or press **1–9**. Choices appear/disappear based on the
  clues (flags) you've gathered.
- **Velma's Case Notes** (**N**, or the notebook button in the header): a running list of
  every clue found, item picked up, and key event — review the whole case at any time.

<details>
<summary><b>Full walkthrough (spoilers!)</b></summary>

1. **Lobby** — flashlight from the front desk drawer; the 1969 brochure from the abandoned
   luggage; as Velma, read the guest ledger; talk to Mr. Crane.
2. **Grounds (east)** — the hub: stick from the bushes, and (as Daphne) the monogrammed glove
   from the pool muck. Gus rakes eternally. Four ways out: toolshed (north, dark), greenhouse
   (south), vine-choked archway (east), pool hatch (down, cranked shut — Fred's job).
2a. **Greenhouse (south)** — grab the **garden shears** from the planter bench.
2b. **Grounds** — use the shears on the **overgrown archway** → the pool cabana opens (east).
2c. **Pool Cabana (east)** — as Shaggy & Scooby, shake the **vending machine** (Scooby Snack +
   chewing gum); Velma can decipher the lifeguard log. Combine stick + gum → **Sticky Stick**.
2d. **Grounds** — flashlight on the dark **toolshed doorway**, then head north inside.
2e. **Toolshed** — Sticky Stick on the floor grate → **Maintenance Key**; take the **crank
   handle** off the pegboard; read the chalk outlines.
2f. *(Optional)* **Grounds** — as **Fred**, crank handle on the **pool hatch** → climb down to
   the **Pump Room**: the phantom's tunnel map, Crane's pump shutdown order, and his supply stash.
3. **Janitor's Closet (west of lobby, use the key)** — flashlight on the shadowy shelf
   (glowing paint!); take the rope and the box cutter; as Daphne, pick the padlocked
   floor grate.
4. **Grounds** — show Gus the glowing paint → he implicates Mr. Crane and hands over the
   office passkey.
5. **Manager's Office (north of lobby, use the passkey)** — as Velma, read the blueprint
   chest (Room 217 exists!); examine the founder's portrait (6-9-1969); open the wall
   safe → draft deed; as Fred, muscle the east bookshelf aside (pull the clean book).
6. **Room 217 (east)** — bag the Wail-o-Phone; cut **George Palm III** free with the box
   cutter; hear his testimony → he'll back you up.
7. **Boiler Room (down from the closet)** — as Fred, rig the rope on the ceiling hook;
   as Shaggy & Scooby, Scooby Snack on the bait crate; pull the red lever.
8. **The accusation** — Gus, George, and "a real ghost" all get comedic rebuttals;
   accuse **Mr. Crane** to close the case.

**Every room has one job per character** (10 gated interactions each for Fred, Daphne, Velma,
and Shaggy & Scooby) — press **H** in any room and try the walkie.

**Combine side-quests** (inventory: click item A, then item B):
- **Clothesline + Horseshoe Magnet → Magnet on a Line.** George hands over the clothesline with
  his testimony; Daphne picks the toolshed toolbox for the magnet. Use it on the pump room's
  barred **BOILER door** → opens a secret east passage straight into the boiler room.
- **Old Bedsheet + Glowing Paint → Counterfeit Phantom.** Fred pops the Room 217 steamer trunk
  for the sheet. Wave it at Mr. Crane (or Gus) and watch the reaction. Also try showing Crane
  the muddy glove...
- **Resort Brochure + Tunnel Map → Marked Resort Map.** Velma overlays them; use the marked map
  on the pump room's **oddly new brickwork** → the phantom's walled-up tool cache.

</details>

## Architecture

```
src/
├── types/game.ts            # Scene / Hotspot / NavLink / Dialogue / Action types
├── data/
│   ├── scenes.json          # THE game: 4 rooms, nav links, hotspots, action triggers
│   ├── dialogues.json       # Branching dialogue trees (flag-gated choices)
│   ├── items.ts             # Item registry (lucide icons) + combine recipes
│   └── characters.ts        # Gang roster: skills, colors, icons
├── engine/
│   └── audio.ts             # HTML5 Audio wrapper → /public/assets/audio/*.mp3
├── store/
│   └── gameStore.ts         # Zustand state machine: room, inventory, flags,
│                            #   active character, dialogue, hotspot/nav resolution
└── components/
    ├── Viewport.tsx         # 16:9 scene render, hotspot hitboxes, nav arrows
    ├── Inventory.tsx        # Bottom tray: select / use / combine items
    ├── DialogueOverlay.tsx  # Branching conversation UI (keyboard 1-9)
    ├── CharacterHub.tsx     # Walkie-talkie character switcher
    ├── MessageBar.tsx       # Narration / feedback strip
    └── WinScreen.tsx        # End-of-case overlay + reset
```

### Adding content

- **New room**: add a node to `scenes.json` (background, gradient, nav links, hotspots).
  No code changes needed.
- **Backdrops**: drop 16:9 images into `public/assets/scenes/` matching the
  `background_image_url` filenames (see the README there). Gradient placeholders render
  until then.
- **Audio**: drop `.mp3` files into `public/assets/audio/` (see the README there).
  Missing files fail silently.
- **Hotspot gates**: `required_character`, `required_item` (+ `consume_item`),
  `required_flags`, `visible_if_flags` / `hidden_if_flags` — all composable.
- **Action triggers**: `add_to_inventory`, `remove_from_inventory`, `set_flag`,
  `show_message`, `start_dialogue`, `play_sfx`, `end_game`.
