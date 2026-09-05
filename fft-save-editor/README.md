# FFT: The Ivalice Chronicles — Save Editor

A browser-based save editor for **FINAL FANTASY TACTICS – The Ivalice Chronicles** (Steam,
app id 1004640) that puts every piece of equipment into your party inventory. Built for
Steam Deck: no install, no terminal. Open the page in Desktop Mode, drop `enhanced.png` in,
pick a slot, download the patched file, copy it back.

Nothing is uploaded anywhere; the whole pipeline runs in the browser tab.

Picking this up as a maintainer rather than a player? Start with [HANDOFF.md](HANDOFF.md).

```bash
npm install
npm run dev     # http://localhost:5175
npm test        # vitest: format round-trips (+ real-file checks when fixtures/enhanced.png exists)
npm run build
```

## Using it on a Steam Deck

1. Quit the game completely.
2. In Desktop Mode open Dolphin, press Ctrl+H to show hidden files, and go to
   ```
   ~/.local/share/Steam/steamapps/compatdata/1004640/pfx/drive_c/users/steamuser/Documents/My Games/FINAL FANTASY TACTICS - The Ivalice Chronicles/Steam/<your Steam ID>/
   ```
   (`~/.steam/steam/steamapps/…` is the same place. If the game is on an SD card the
   library is under `/run/media/…/steamapps/compatdata/1004640/…`.)
3. **Copy the whole `<your Steam ID>` folder somewhere safe.** That is your backup.
4. In Steam: right-click the game → Properties → General → turn **Steam Cloud** off for this
   game. Otherwise Cloud may restore the old file.
5. Open the editor page, load `enhanced.png`, pick the slot you play on (the most recent one
   is preselected), choose the count (99 by default) and categories, click **Apply**, then
   **Download**.
6. Replace `enhanced.png` in that folder with the downloaded file. Keep the exact name.
7. Launch the game, load that slot, open the inventory. Save in-game once to commit.

## What it edits

Only two things change in the file:

- the 261-byte **party inventory** of the slot you chose (one byte per item id = count), and
- the CRC-32 **checksum** in the save header.

Units, gil, story flags, shop stock, thumbnails and everything else are copied through
byte-for-byte. Item ids 0, 254 and 255 are never written (they are "nothing" / blank and 0xFF is
also the empty-equipment sentinel). Consumables (Potions, Shuriken, Bombs) are left alone.

After building the patched file the editor re-opens it and checks the checksum and the
inventory bytes before offering the download.

## Format notes

`enhanced.png` is a real PNG whose payload sits in a private chunk named `ffTo`:

| Layer | Details |
|---|---|
| PNG | standard chunks; the `ffTo` chunk is replaced in place, all others untouched |
| UMIF container | `0x08` magic `"UMIF"`, `0x0C` file count; one 0x20-byte entry per file with name/data pointers and lengths |
| Obfuscation | names and data XORed with the repeating key `F3 C4 1F 5F FE 80 3F 0F` |
| Compression | zlib with a 32 KB preset dictionary; the 2-byte zlib header (`78 F9`) is stripped on disk |
| `fftsave.bin` | 2,007,816 bytes: 16-byte header (`+0x04` CRC-32 over `[0x10..]`), then 50 slots × 40,156 bytes |
| Slot | `+0x00` magic (0 = empty), `+0x04` title, `+0x44` timestamp, `+0x120` playtime, `+0x518` 54 units × 600 B, `+0x83A8` inventory[261] |

`autoenhanced.png` (the autosave / in-battle history) is a multi-file container and is
rejected rather than edited. Resume saves (`enwm_*.sav`) are rejected too.

## Known limits

- Each slot carries a 16-byte digest at `+0x164` whose algorithm has not been identified.
  Other editors leave it as-is and the game accepts their saves; this editor does the same.
  Keep your backup until you have confirmed the patched save loads.
- The in-game inventory sort order is not rebuilt, so new items may show up in an odd order
  until you sort in-game.
- Gil is not mapped by any public tool and is out of scope.

## Testing against a real save

Put a copy of your `enhanced.png` at `fixtures/enhanced.png` and run `npm test`. The
real-file tests check that the container unpacks to exactly 2,007,816 bytes, that the stored
checksum matches the one we compute (proof the decode is right), that populated slots parse,
that unpack(pack(x)) is byte-identical, and that an inventory edit changes only the expected
bytes.

## Credits

- Container format (PNG chunk, UMIF, XOR key, preset dictionary) from
  [Nenkai/FF16Tools](https://github.com/Nenkai/FF16Tools) (MIT). The dictionary in
  `src/format/dict.ts` is copied verbatim from there.
- Save layout offsets from community reverse engineering, notably
  [TICSaveEditor](https://github.com/Nelveska/TICSaveEditor) and
  [FFTIvaliceEditor](https://github.com/mullerdane85-hash/FFTIvaliceEditor). Only the
  documented offsets and tables were used; no code was copied.
- Item, job and name tables from the game's data files.

Fan-made, not affiliated with Square Enix. Use at your own risk.
