export const DECK_SAVE_PATH =
  '~/.local/share/Steam/steamapps/compatdata/1004640/pfx/drive_c/users/steamuser/Documents/My Games/FINAL FANTASY TACTICS - The Ivalice Chronicles/Steam/<your Steam ID>/enhanced.png'

export function Instructions() {
  return (
    <div className="space-y-4 text-sm leading-6 text-stone-300">
      <section>
        <h3 className="font-bold text-amber-200">Where the save lives on Steam Deck</h3>
        <p>In Desktop Mode, open Dolphin, turn on <em>Show Hidden Files</em> (Ctrl+H), and go to:</p>
        <pre className="mt-1 overflow-x-auto rounded bg-stone-950 p-2 text-xs text-amber-100">{DECK_SAVE_PATH}</pre>
        <p className="mt-1 text-stone-400">
          If the game is installed on an SD card, <code>compatdata</code> is under <code>/run/media/…/steamapps/</code> instead.
          On Windows it is <code>Documents\My Games\FINAL FANTASY TACTICS - The Ivalice Chronicles\Steam\&lt;Steam ID&gt;\</code>.
        </p>
      </section>
      <section>
        <h3 className="font-bold text-amber-200">Do this in order</h3>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Quit the game completely.</li>
          <li>Copy the whole <code>&lt;your Steam ID&gt;</code> folder somewhere safe. This is your backup.</li>
          <li>In Steam, right-click the game → <em>Properties</em> → <em>General</em> → turn off <em>Steam Cloud</em> for this game. Otherwise Cloud can put the old file back.</li>
          <li>Load <code>enhanced.png</code> here, pick the slot you play on, apply, and download.</li>
          <li>Replace <code>enhanced.png</code> in that folder with the downloaded file (keep the exact name).</li>
          <li>Launch the game, load that slot, open the inventory. Save in-game once to commit the change.</li>
        </ol>
      </section>
      <section>
        <h3 className="font-bold text-amber-200">Good to know</h3>
        <ul className="list-disc space-y-1 pl-5 text-stone-400">
          <li>Only the manual save list (<code>enhanced.png</code>) is supported. <code>autoenhanced.png</code> is a different container and is rejected.</li>
          <li>Only the party inventory bytes and the file checksum are changed. Units, gil, story flags and everything else are copied through untouched.</li>
          <li>The inventory sort order is not rebuilt, so new items may appear in an odd order until you sort in-game.</li>
          <li>Each slot also carries a small digest whose algorithm nobody has identified yet. Other editors leave it alone and the game accepts their saves, and so does this one. Keep the backup until you have confirmed your save loads.</li>
        </ul>
      </section>
    </div>
  )
}
