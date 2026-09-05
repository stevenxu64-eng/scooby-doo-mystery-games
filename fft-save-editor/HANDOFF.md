# Handoff — FFT: The Ivalice Chronicles save editor

Everything a new person (or session) needs to pick this up cold. For how to *use* the editor,
read [README.md](README.md) instead; this file is about the state of the work.

Branch `claude/fft-save-editor-1z20of`, commit `c7457d1`. No pull request opened.

## Status at a glance

| | |
|---|---|
| **Done** | The editor works end to end: load `enhanced.png`, pick a slot, grant every piece of equipment, download a patched file. Wired into the launcher and the Pages deploy. |
| **Verified** | 17 unit tests, a browser run against the built site, and an independent Python decoder that agrees with the TypeScript byte for byte. |
| **Not yet verified** | **No real save has ever been through it.** All testing used synthetic data built from the documented layout. |
| **Next step** | Commit a real `enhanced.png` to `fixtures/`, run the tests, then try it on the Deck. |

## What was built

A Vite + React + TypeScript app at `fft-save-editor/`, styled like the other two projects in
this repo. It runs entirely in the browser: no server, no upload, no install. The user opens
the page in Steam Deck Desktop Mode, drops in their save, and gets a patched file back.

### Source map

| File | What it does |
|---|---|
| `src/format/crc32.ts` | Table-driven IEEE CRC-32. Used for both PNG chunk CRCs and the save header checksum. |
| `src/format/png.ts` | PNG chunk walker. Finds and replaces the `ffTo` chunk; never decodes the image. |
| `src/format/umif.ts` | The UMIF container: XOR obfuscation, zlib with the preset dictionary, TOC layout. |
| `src/format/dict.ts` | The 32 KB zlib preset dictionary, base64 inlined. Copied verbatim from FF16Tools (MIT). |
| `src/format/save.ts` | `fftsave.bin` layout: slot parsing, unit summaries, inventory read/write, checksum. |
| `src/format/equipment.ts` | Which item ids count as equipment, and `planGrant` (what would change and to what). |
| `src/format/editor.ts` | The pipeline tying it together: `loadSavePng` and `buildPng`. |
| `src/data/items.ts` | All 261 items: id, name, category, price, level, shop tag. Generated from game data. |
| `src/data/names.ts` | Job and character name lookups, for labelling units in the slot list. Display only. |
| `src/components/` | `FileDrop`, `SlotList`, `GrantPanel`, `Instructions`. |
| `src/hooks/useGrantPlan.ts` | Memoised wrapper over `planGrant`. Separate file so fast refresh works. |
| `src/App.tsx` | The four-step flow and the verify-before-download step. |

Tests live in `src/format/__tests__/` and are excluded from the production build.

### Repo wiring touched

- `scripts/build-site.sh` — builds the editor and copies it to `dist-site/fft-save-editor/`.
- `.github/workflows/deploy.yml` — added `npm ci --prefix fft-save-editor`.
- `site/index.html` — third card on the launcher page.
- `.claude/launch.json` — dev config on port 5175.
- root `README.md` — mentions the editor alongside the two games.

## Format cheat sheet

Enough to work on this without re-deriving anything. All little-endian unless noted.

**PNG layer.** A real PNG. The payload is in a private chunk typed `ffTo` (`66 66 54 6F`).
Only that chunk is rewritten; every other chunk, thumbnail included, is passed through
untouched.

**UMIF container** (the chunk's data):

```
0x00 u32 tocSize (0x10 + n*0x20)    0x04 u32 0
0x08 u32 magic 0x46494D55 "UMIF"    0x0C u32 numFiles
entry i at 0x10 + i*0x20:
  +0x00 u32 nameLen (incl. NUL)   +0x04 u32 dataLen   +0x08 i64 namePtr
  +0x10 i64 decompressedLen       +0x18 i64 dataPtr
```

Names and data are XORed with the repeating key `F3 C4 1F 5F FE 80 3F 0F`. Data is a zlib
stream compressed against a 32 KB preset dictionary, with the 2-byte header (`78 F9`) stripped
on disk. Dictionary hashes for sanity checks: CRC-32 `0x2C96DD9F`, Adler-32 `0x4DAFCB9C`.
`enhanced.png` holds exactly one file, named `fftsave.bin`.

**`fftsave.bin`** is 2,007,816 bytes: a 16-byte header then 50 slots of `0x9CDC` (40,156)
bytes each.

| Offset | Field |
|---|---|
| `+0x04` (file) | CRC-32 over `[0x10..EOF]`. Must be recomputed after any edit. |
| `+0x08` (file) | Discriminator. `0x10` means a resume save, which is rejected. |
| slot `+0x0000` | u16 magic. Zero means the slot is empty. |
| slot `+0x0004` | Title, 64 bytes, NUL-terminated. |
| slot `+0x0044` | i32 Unix timestamp. |
| slot `+0x0120` | i32 playtime in **minutes**. |
| slot `+0x0518` | 54 unit records of 600 bytes. |
| slot `+0x83A8` | **Party inventory: 261 bytes, index == item id, value == count.** |

Item ids 0, 254 and 255 are never written: 0 is "Nothing Equipped", 254/255 are blank, and
`0xFF` doubles as the empty-equipment sentinel in unit records. 238 of the 261 ids are
equipment; the rest are consumables (Potions, Shuriken, Bombs) and are left alone.

## How it was verified

1. **Unit tests** (`npm test`, 17 passing). CRC-32 against published vectors, the dictionary
   hashes, the XOR key, UMIF pack/unpack round trips at several lengths, PNG chunk replacement
   preserving neighbours, slot parsing, grant planning, and a synthetic end-to-end that asserts
   only inventory bytes changed.
2. **Browser run.** Playwright drove the built page in Chromium with a synthetic save: file
   upload, slot detection, plan preview, apply, download. Zero console errors. The
   before/after screenshots matched the intended design.
3. **Independent cross-check.** A throwaway Python implementation of the container (using
   `zlib` with `zdict`) built a synthetic save that the TypeScript decoded correctly, and
   decoded the file the browser produced: 238 items at 99, checksum valid, consumables
   untouched, and every non-`ffTo` PNG chunk byte-identical to the input.
4. **Builds.** `npm run build`, `npm run lint` and the root `npm run build:site` all pass.

The gap this leaves: the layout came from reverse-engineering two other tools, not from a real
file. Point 5 below closes it.

## Open items, in priority order

1. **Add the real fixture.** Copy a real `enhanced.png` to `fft-save-editor/fixtures/` and run
   `npm test`. Expect 22 passing instead of 17 — five tests activate automatically when the
   file is present. They check that the container unpacks to exactly 2,007,816 bytes, that the
   stored checksum matches the computed one, that populated slots parse into plausible values,
   that repacking is byte-identical, and that an edit touches only the expected bytes.
   **If the checksum test fails, stop.** That means this game version's layout differs from
   what the editor assumes, and nothing should be shipped until the difference is understood.
2. **First real trial on the Deck.** Back up the save folder, turn off Steam Cloud for the
   game, replace the file, load the slot, confirm the inventory, save in-game. Record the
   result here so the next person knows whether the format assumptions hold.
3. **Merge to `main`.** The Pages workflow then publishes it under `/fft-save-editor/`.
4. **Not started, in rough order of value:** a per-item editable grid for consumables and fine
   control; shop stock at slot `+0x84AD` (same shape, but that offset is an unverified
   assumption in the reference tool); rebuilding the inventory sort blob at slot `+0x8A32` so
   new items appear in a sensible order; gil, which no public tool has mapped.

## Commands

```bash
cd fft-save-editor
npm install          # .npmrc pins legacy-peer-deps; see gotchas
npm run dev          # http://localhost:5175
npm test             # vitest
npm run build        # tsc -b && vite build
npm run lint

# from the repo root, the whole static site:
npm run build:site
python3 -m http.server 4173 -d dist-site   # then /fft-save-editor/
```

## Gotchas

- **`legacy-peer-deps` is required.** vitest 4 and vite 8 have a peer conflict that makes
  `npm install` fail with `Cannot read properties of null (reading 'edgesOut')` under npm 10.
  `.npmrc` pins the flag so both local installs and CI `npm ci` work. If you upgrade either
  package, retry without it.
- **Tests are excluded from `tsconfig.app.json`.** They import `node:fs`, and including them
  would force Node types into the browser build.
- **pako's function-form types lack `dictionary`.** `umif.ts` uses the `Inflate` class instead
  of the `inflate()` helper. Not a workaround for a bug, just the typed path.
- **`autoenhanced.png` is rejected on purpose.** It is a multi-file container (the in-battle
  autosave history) with a different structure. The error message says so.
- **The 16-byte digest at slot `+0x164` is left alone.** Nobody has identified the algorithm.
  Other editors leave it stale and the game accepts their saves, so this one does the same.
  If a patched save is ever refused by the game, suspect this first.

## References

- [Nenkai/FF16Tools](https://github.com/Nenkai/FF16Tools) (MIT) — the container format and the
  preset dictionary in `src/format/dict.ts`. The only code copied from anywhere.
- [TICSaveEditor](https://github.com/Nelveska/TICSaveEditor) (GPL-3) — the save layout offsets.
  Documented offsets and data tables only; no code was copied, deliberately, because of the
  licence.
- [FFTIvaliceEditor](https://github.com/mullerdane85-hash/FFTIvaliceEditor) — corroborated the
  slot stride and unit record size independently.

Save path on Steam Deck (Desktop Mode, Ctrl+H to show hidden files):

```
~/.local/share/Steam/steamapps/compatdata/1004640/pfx/drive_c/users/steamuser/Documents/My Games/FINAL FANTASY TACTICS - The Ivalice Chronicles/Steam/<Steam ID>/
```
