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

- **Move** between screens with the on-screen arrows, or **Arrows/WASD** (Q/E for up/down).
- **Click hotspots** to examine, collect, and talk. Press **H** to outline all hotspots.
- **Inventory**: click an item to arm it, then click a hotspot to use it — or click a
  *second* item to try combining them (e.g. Long Stick + Chewing Gum).
- **Walkie-talkie**: switch between Velma / Shaggy & Scooby / Daphne. Some obstacles only
  yield to the right gang member (Velma reads documents, Shaggy & Scooby handle snacks
  and bait, Daphne picks locks).
- **Dialogue**: click a branch or press **1–9**. Choices appear/disappear based on the
  clues (flags) you've gathered.

<details>
<summary><b>Full walkthrough (spoilers!)</b></summary>

1. **Lobby** — take the flashlight from the front desk drawer; as Velma, read the guest
   ledger; talk to Mr. Crane.
2. **Grounds (east)** — grab the stick from the bushes; switch to Shaggy & Scooby and
   shake the vending machine (Scooby Snack + chewing gum); combine stick + gum into the
   Sticky Stick; use the flashlight on the dark toolshed, then the Sticky Stick on the
   floor grate → Maintenance Key.
3. **Lobby** — use the key on the closet door, go west into the **Janitor's Closet** —
   use the flashlight on the shadowy shelf (glowing paint!), take the rope, and switch to
   Daphne to pick the padlocked floor grate.
4. **Grounds** — show Janitor Gus the glowing paint → he implicates Mr. Crane.
5. **Boiler Room (down from the closet)** — use the rope on the ceiling hook, switch to
   Shaggy & Scooby and use the Scooby Snack on the bait crate, then pull the red lever.
6. **The accusation** — the gang won't pull the sheet until you name the culprit. Wrong
   guesses (Gus, "a real ghost") get comedic rebuttals; accuse **Mr. Crane** to win.

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
