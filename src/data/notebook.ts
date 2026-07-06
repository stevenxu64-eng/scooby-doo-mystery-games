/**
 * Velma's Case Notes — the game's running log.
 *
 * Every meaningful flag maps to one notebook line (clue or event), written in
 * Velma's voice. Item pickups and crafted combos are logged automatically by
 * the store. Entries are appended in discovery order and deduped by `key`.
 */

export type CaseLogKind = 'clue' | 'item' | 'event'

export interface CaseLogEntry {
  id: number
  /** Dedupe key: `flag:<flag>` or `item:<itemId>`. */
  key: string
  kind: CaseLogKind
  text: string
}

export interface NotebookNote {
  flag: string
  kind: 'clue' | 'event'
  text: string
}

/** Ordered roughly along the golden path — this order is used to backfill notebooks for older saves. */
export const NOTEBOOK_NOTES: NotebookNote[] = [
  // — Lobby —
  { flag: 'read_ledger', kind: 'clue', text: "The guest ledger: the resort is drowning in debt — and supplies were billed to Room 217, a room that doesn't exist." },
  { flag: 'sniffed_poster', kind: 'clue', text: "The phantom's 'warning' poster is scrawled in FRESH marker ink. Fifty-year-old ghosts don't buy new markers." },
  { flag: 'fred_moved_chair', kind: 'clue', text: 'Drag tracks under the lobby armchair run straight toward the office stairs — someone rearranges this lobby after hours.' },
  { flag: 'daphne_saw_wire', kind: 'clue', text: "The lobby chandelier is rigged to 'sway' with a hidden pull-wire. Special effects on a community-theater budget." },
  // — Grounds —
  { flag: 'got_glove', kind: 'clue', text: "A dress glove from the pool muck, monogrammed 'A.C.' — Ambrose Crane wears gloves just like it." },
  { flag: 'read_pool_prints', kind: 'clue', text: 'Footprints in the drained pool: size-12 sneakers, even stride, always exiting toward the lobby. Employees commute; ghosts float.' },
  { flag: 'shaggy_found_tracks', kind: 'clue', text: 'A line of crushed mushrooms — someone HEAVY tromped toward the toolshed recently.' },
  { flag: 'shed_lit', kind: 'event', text: 'Lit up the dark toolshed — something glints under its floor grate.' },
  { flag: 'path_cleared', kind: 'event', text: 'Sheared the vines off the stone archway. The pool cabana is open.' },
  { flag: 'hatch_open', kind: 'event', text: 'Cranked open the maintenance hatch beside the pool — there are service tunnels under this resort.' },
  // — Greenhouse —
  { flag: 'velma_swabbed_pot', kind: 'clue', text: 'Glowing residue in a shattered greenhouse pot — the phantom rotates his paint stashes.' },
  { flag: 'fred_found_bootprint', kind: 'clue', text: 'Under the tipped greenhouse urn: a perfect size-12 diamond-tread boot print. Same tread as the pool.' },
  { flag: 'daphne_found_thread', kind: 'clue', text: "A glow-green costume thread snagged shoulder-high on a greenhouse thorn — at exactly Crane's height." },
  { flag: 'scooby_dug_soil', kind: 'clue', text: "Buried in the greenhouse dirt: sandwich crusts and a still-fizzy soda. Phantoms don't pack lunch." },
  // — Pool cabana —
  { flag: 'shook_vending', kind: 'event', text: 'Shook down the cabana vending machine: one Scooby Snack, one pack of extra-sticky gum.' },
  { flag: 'read_lifeguard_log', kind: 'clue', text: 'The lifeguard log: guest counts fell off a cliff the week the Phantom debuted. This haunting had a start date.' },
  { flag: 'daphne_picked_locker', kind: 'clue', text: "The cabana staff locker holds a blazer dry-cleaned LAST WEEK — ticket signed 'A.C.'" },
  { flag: 'fred_fixed_chair', kind: 'clue', text: 'From the lifeguard stand you can see every window of the resort. The perfect lookout for scheduling scares.' },
  // — Toolshed —
  { flag: 'velma_read_outlines', kind: 'clue', text: "Gus's chalk outlines: the BOLT CUTTERS and PAINT SPRAYER are missing from the shed." },
  { flag: 'fred_moved_bench', kind: 'clue', text: "Behind the toolshed workbench: a stash tin of green-stained rags. The phantom preps his act in Gus's shed." },
  { flag: 'got_magnet', kind: 'clue', text: 'The padlocked toolbox is oiled, organized, alphabetized — and held a BRAND-NEW magnet. Our ghost shops retail.' },
  { flag: 'found_sleeping_bag', kind: 'clue', text: "A sleeping bag stashed inside a soil sack — someone's been camping in the toolshed." },
  // — Pump room —
  { flag: 'read_pump_log', kind: 'clue', text: "Pump log: 'PUMPS SHUT DOWN — BY ORDER OF A. CRANE.' The ruined pool is a business decision." },
  { flag: 'fred_turned_valve', kind: 'clue', text: 'The pumps still WORK. The drained pool is sabotage, not decay.' },
  { flag: 'daphne_opened_panel', kind: 'clue', text: 'One unlabeled, brand-new breaker circuit wired straight past the meter, humming toward the boiler room.' },
  { flag: 'scooby_sniffed_trail', kind: 'clue', text: "Scooby's verdict: the glowing prints in the pump room are MINUTES old, heading for the boiler door." },
  { flag: 'got_tunnel_map', kind: 'clue', text: "The phantom's hand-drawn tunnel map: pool pumps → laundry → boiler room. That's how he haunts the resort unseen." },
  { flag: 'boiler_door_open', kind: 'event', text: "Fished the bar off the BOILER door with the magnet line — a secret passage into the phantom's lair." },
  { flag: 'found_phantom_kit', kind: 'clue', text: "Behind oddly-new brickwork: Gus's missing bolt cutters and paint sprayer, wrapped in an 'A.C.' handkerchief." },
  // — Janitor's closet —
  { flag: 'closet_unlocked', kind: 'event', text: "Unlocked the janitor's closet with the maintenance key." },
  { flag: 'found_glowing_paint', kind: 'clue', text: "LUMO-GLOW 'Phantom Green' theatrical paint on the closet shelf — the EXACT shade of our ghost." },
  { flag: 'read_invoice', kind: 'clue', text: 'A crumpled invoice: six cans of LUMO-GLOW charged to Room 217. Someone hides purchases inside a fake room number.' },
  { flag: 'fred_moved_cabinet', kind: 'clue', text: 'A hollow behind the closet cabinet ringed with fresh paint-can marks — a rotating supply drop.' },
  { flag: 'scooby_found_wrappers', kind: 'clue', text: 'A burger wrapper and a COLD soda behind the closet mops. The phantom eats fast food.' },
  { flag: 'trap_room_open', kind: 'event', text: 'Daphne picked the padlocked floor grate — the boiler room below is open.' },
  // — Gus —
  { flag: 'knows_truth', kind: 'clue', text: "Gus cracked: MR. CRANE ordered the glowing paint, 'for a pool mural'. Gus will back our story." },
  { flag: 'got_office_key', kind: 'event', text: "Gus handed over his spare office passkey — and mentioned BANGING from behind the office wall." },
  // — Office —
  { flag: 'office_unlocked', kind: 'event', text: "Unlocked the manager's office." },
  { flag: 'knows_217', kind: 'clue', text: "The master blueprint proves Room 217 exists — hidden behind the office bookshelf. 'PORTRAIT KNOWS THE COMBINATION.'" },
  { flag: 'saw_portrait', kind: 'clue', text: "The founder's brass plate: 'FOUNDED THIS PARADISE 6-9-1969.' That's a safe combination if I ever read one." },
  { flag: 'safe_open', kind: 'clue', text: "Crane's safe: a pre-drafted deed selling the Grand Palm to 'A. CRANE' for a tenth of its value — dated NEXT WEEK." },
  { flag: 'daphne_picked_desk', kind: 'clue', text: "Crane's locked drawer: foreclosure warnings and the headline 'PALM HEIR RETURNS'. The heir is here... somewhere." },
  { flag: 'found_fresh_snacks', kind: 'clue', text: "The office globe bar is freshly restocked. Nobody 'abandons' a resort and keeps buying fancy peanuts." },
  { flag: 'door_217_open', kind: 'event', text: 'Fred hauled the bookshelf aside — Room 217 is real, and open.' },
  // — Room 217 —
  { flag: 'george_freed', kind: 'event', text: 'Found GEORGE PALM III — the heir, and our actual client — tied to a chair in Room 217. Cut him loose.' },
  { flag: 'george_witness', kind: 'clue', text: "George saw the phantom up close: silver hair, staff watch, jingling MASTER KEYRING. He'll testify." },
  { flag: 'daphne_read_rack', kind: 'clue', text: 'The phantom sews his costumes from bulk fabric — receipt from Palm County Fabric, twelve days ago.' },
  { flag: 'velma_read_machine', kind: 'clue', text: "The Room 217 sewing machine's needle was still WARM. He tailors here — recently, and often." },
  { flag: 'found_fresh_sandwich', kind: 'clue', text: 'A room-service club sandwich in 217, still soft. The phantom had lunch here TODAY.' },
  { flag: 'fred_opened_trunk', kind: 'event', text: "Fred cracked the chained steamer trunk — mothballs, spare linens, and one 'borrowed' bedsheet." },
  // — Boiler room —
  { flag: 'velma_read_gauge', kind: 'clue', text: "The boiler ran within the hour. Abandoned resorts don't heat themselves." },
  { flag: 'daphne_read_costume', kind: 'clue', text: 'The hanging phantom costume is still WET — same hurried stitching as the Room 217 sheets.' },
  { flag: 'rope_set', kind: 'event', text: 'Fred rigged the Palm Beach Snare over the bait crate.' },
  { flag: 'bait_set', kind: 'event', text: 'The last Scooby Snack is on the crate. The trap is live.' },
  // — Field work with props —
  { flag: 'crane_rattled', kind: 'clue', text: "Crane critiqued our fake phantom's HEM. He knows the real costume intimately." },
  { flag: 'crane_glove_slip', kind: 'clue', text: "The muddy glove's TWIN is peeking out of Crane's jacket pocket." },
  { flag: 'gus_spooked', kind: 'event', text: 'Field test: Gus was not fooled by our counterfeit phantom. Rake readiness: high.' },
  { flag: 'trap_sprung', kind: 'event', text: 'THE TRAP SPRUNG — the Phantom Guest is in the net!' },
]

export const NOTEBOOK_BY_FLAG: Record<string, NotebookNote> = Object.fromEntries(
  NOTEBOOK_NOTES.map((n) => [n.flag, n]),
)
