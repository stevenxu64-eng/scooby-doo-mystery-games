import type { CharacterId } from '../types/game'

export interface RoomHint {
  /** Once this flag is set, the job here is done — fall back to the generic walkie line. */
  done_flag?: string
  text: string
}

/**
 * Room-aware walkie chatter: when the player switches to a character, that
 * character calls out what they're itching to do in the CURRENT room. This is
 * the game's built-in hint system — every gated hotspot has a matching line,
 * and each line names its target so the player is never lost.
 */
export const ROOM_HINTS: Record<string, Record<CharacterId, RoomHint>> = {
  lobby: {
    Fred: {
      done_flag: 'fred_moved_chair',
      text: "That dust-sheeted armchair's hanging crooked, like it gets dragged around a lot. Want me to move it and find out why?",
    },
    Daphne: {
      done_flag: 'daphne_saw_wire',
      text: 'Chandeliers don’t sway in dead air, gang. Someone should get a closer look at that chain. Someone with taste. Me.',
    },
    Velma: {
      done_flag: 'read_ledger',
      text: 'A guest ledger, right on the front desk! Give me one look at the bookkeeping and I’ll give you a motive.',
    },
    Shaggy_Scooby: {
      done_flag: 'sniffed_poster',
      text: 'Like, that phantom poster REEKS of fresh marker, man. Scooby’s nose is twitching from here.',
    },
  },
  grounds: {
    Fred: {
      done_flag: 'hatch_open',
      text: 'That pool hatch is cranked shut tight. Find me the crank handle — sheds usually keep one — and I’ll put my back into it.',
    },
    Daphne: {
      done_flag: 'got_glove',
      text: 'There’s something pale half-buried in the pool muck. Nobody touch it — you’ll smudge the monogram. I’ve got this.',
    },
    Velma: {
      done_flag: 'read_pool_prints',
      text: 'Those footprints in the drained pool aren’t random. Let me measure the stride and we’ll know exactly how our “ghost” walks.',
    },
    Shaggy_Scooby: {
      done_flag: 'shaggy_found_tracks',
      text: 'Like, mushrooms grow by the shed, man! Snack break? ...Scooby says some are SQUASHED flat. That’s weird, right?',
    },
  },
  janitor_closet: {
    Fred: {
      done_flag: 'fred_moved_cabinet',
      text: 'That steel supply cabinet is sitting crooked — like somebody shoves it aside a lot. My kind of furniture.',
    },
    Daphne: {
      done_flag: 'trap_room_open',
      text: 'A padlocked floor grate with green light seeping up through it? Hand me a hairpin and stand back, gang.',
    },
    Velma: {
      done_flag: 'read_invoice',
      text: 'There’s a crumpled invoice under the light. Supplier fine print is basically my beach reading.',
    },
    Shaggy_Scooby: {
      done_flag: 'scooby_found_wrappers',
      text: 'Like, Scooby smells something under all that bleach... something with FRIES, man. Check the mop corner.',
    },
  },
  trap_room: {
    Fred: {
      done_flag: 'rope_set',
      text: 'See that iron hook over the crate? Get me a rope and I’ll rig a snare this phantom will write home about.',
    },
    Daphne: {
      done_flag: 'daphne_read_costume',
      text: 'That glowing bedsheet is a WARDROBE, not a ghost. Let me read its stitching — fabric never lies.',
    },
    Velma: {
      done_flag: 'velma_read_gauge',
      text: 'Look at the boiler’s pressure gauge, gang. Abandoned resorts should not have OPERATING boilers.',
    },
    Shaggy_Scooby: {
      done_flag: 'bait_set',
      text: 'That crate under the net needs bait, man. Tragically, Scooby and I are the world’s leading bait experts.',
    },
  },
  office: {
    Fred: {
      done_flag: 'door_217_open',
      text: 'If Velma’s blueprint says that east bookshelf moves, then it moves. Moving suspiciously heavy furniture? Say no more.',
    },
    Daphne: {
      done_flag: 'daphne_picked_desk',
      text: 'Crane’s desk drawer is LOCKED. Locked drawers are just gift wrap, honestly.',
    },
    Velma: {
      done_flag: 'knows_217',
      text: 'A chest of original blueprints! Let me cross-reference the floor plan — I smell an architectural lie.',
    },
    Shaggy_Scooby: {
      done_flag: 'found_fresh_snacks',
      text: 'Like, that fancy globe is secretly a SNACK BAR, man. Investigating it is our civic duty.',
    },
  },
  room_217: {
    Fred: {
      done_flag: 'fred_opened_trunk',
      text: 'That steamer trunk’s latches are rusted shut. Rusted latches are just a countdown to my knee-drop.',
    },
    Daphne: {
      done_flag: 'daphne_read_rack',
      text: 'A whole rack of half-sewn phantom costumes? Somebody hold my headband — I’m reading every hem.',
    },
    Velma: {
      done_flag: 'velma_read_machine',
      text: 'The sewing machine is still threaded. If that needle’s warm, our phantom was JUST here.',
    },
    Shaggy_Scooby: {
      done_flag: 'found_fresh_sandwich',
      text: 'There’s a room-service tray with a DOME on it, man. Domes mean food. Scooby — we’re going in.',
    },
  },
  toolshed: {
    Fred: {
      done_flag: 'fred_moved_bench',
      text: 'That workbench isn’t bolted down — it’s just heavy. Heavy and I have an understanding.',
    },
    Daphne: {
      done_flag: 'got_magnet',
      text: 'A tiny padlock on a tiny red toolbox. Adorable. Watch this.',
    },
    Velma: {
      done_flag: 'velma_read_outlines',
      text: 'Gus chalked an outline for every tool on that wall. Inventory-by-absence — my favorite puzzle genre.',
    },
    Shaggy_Scooby: {
      done_flag: 'found_sleeping_bag',
      text: 'Like, one of those soil sacks is LUMPY, man. Lumpy like a hidden something. Scooby — dig formation!',
    },
  },
  greenhouse: {
    Fred: {
      done_flag: 'fred_found_bootprint',
      text: 'Somebody knocked over that stone urn — and it takes a ME to lift one. Let’s see what’s underneath.',
    },
    Daphne: {
      done_flag: 'daphne_found_thread',
      text: 'There’s a glint on the thorny vine by the west frame. Trust me — that’s a THREAD, and threads talk.',
    },
    Velma: {
      done_flag: 'velma_swabbed_pot',
      text: 'That shattered pot is dusted with glowing residue. I need a swab and thirty seconds.',
    },
    Shaggy_Scooby: {
      done_flag: 'scooby_dug_soil',
      text: 'Fresh-turned dirt by the path, man! Scooby only digs where something’s buried. It’s science.',
    },
  },
  pool_cabana: {
    Fred: {
      done_flag: 'fred_fixed_chair',
      text: 'That lifeguard stand is down a leg. Prop it level and it’s the best lookout on the property.',
    },
    Daphne: {
      done_flag: 'daphne_picked_locker',
      text: 'A padlocked STAFF cabinet built into the tiki bar. “Staff,” huh? Let’s meet the staff.',
    },
    Velma: {
      done_flag: 'read_lifeguard_log',
      text: 'The lifeguard logbook is chained to the stand — waterlogged shorthand, be still my heart.',
    },
    Shaggy_Scooby: {
      done_flag: 'shook_vending',
      text: 'LIKE, MAN. VENDING MACHINE. Scooby and I have trained our entire lives for this moment.',
    },
  },
  pump_room: {
    Fred: {
      done_flag: 'fred_turned_valve',
      text: 'The main pump’s wheel is sheared off — but there’s a square crank socket. Crank plus me equals answers.',
    },
    Daphne: {
      done_flag: 'daphne_opened_panel',
      text: 'That breaker cabinet is latched shut with green light leaking from the seam. One hairpin, coming up.',
    },
    Velma: {
      done_flag: 'read_pump_log',
      text: 'A maintenance clipboard by Pump No. 1! Pump logs are DIARIES, gang. Ghosts don’t file paperwork.',
    },
    Shaggy_Scooby: {
      done_flag: 'scooby_sniffed_trail',
      text: 'Zoinks, those footprints GLOW, man... Scooby can tell fresh paint from stale. Right, buddy? ...Buddy?',
    },
  },
}
