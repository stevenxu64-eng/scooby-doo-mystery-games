// Layout of fftsave.bin (the manual-save file inside enhanced.png).
//
//   0x00 u32 version   0x04 u32 CRC-32 over [0x10..EOF]   0x08 u64 discriminator (0x10 = resume save)
//   0x10 .. 50 slots x 0x9CDC bytes
//
// Slot layout (relative to the slot base):
//   +0x0000 u16 magic (0 = empty slot)      +0x0004 title (64 bytes, NUL-terminated ASCII)
//   +0x0044 i32 unix timestamp              +0x0120 i32 playtime in minutes
//   +0x0518 units: 54 x 600 bytes           +0x83A8 party inventory: 261 x u8 (index == item id)
//
// Offsets come from community reverse engineering (TICSaveEditor layout + FFTIvaliceEditor),
// cross-checked against each other. Everything not listed here is preserved byte-for-byte.
import { crc32 } from './crc32.ts'
import { CHARA_NAMES, JOB_NAMES } from '../data/names.ts'

export const HEADER_SIZE = 0x10
export const SLOT_COUNT = 50
export const SLOT_SIZE = 0x9cdc
export const SAVE_SIZE = HEADER_SIZE + SLOT_COUNT * SLOT_SIZE // 2,007,816
export const RESUME_DISCRIMINATOR = 0x10n

export const SLOT_MAGIC_OFFSET = 0x0000
export const SLOT_TITLE_OFFSET = 0x0004
export const SLOT_TITLE_LENGTH = 0x40
export const SLOT_TIMESTAMP_OFFSET = 0x0044
export const SLOT_PLAYTIME_OFFSET = 0x0120
export const SLOT_UNITS_OFFSET = 0x0518
export const UNIT_SIZE = 600
export const UNIT_COUNT = 54
export const SLOT_INVENTORY_OFFSET = 0x83a8
export const INVENTORY_SIZE = 0x105 // 261 item ids

// Unit record fields (relative to the unit base) that we only read for display.
const UNIT_CHARACTER = 0x00
const UNIT_INDEX = 0x01
const UNIT_JOB = 0x02
const UNIT_LEVEL = 0x1d
const UNIT_BRAVE = 0x1e
const UNIT_FAITH = 0x1f
const UNIT_NICKNAME = 0xdc
const UNIT_NICKNAME_LENGTH = 16
const UNIT_NAME_NO = 0x11c

export interface UnitSummary {
  index: number
  name: string
  job: string
  level: number
  brave: number
  faith: number
}

export interface SlotSummary {
  index: number
  isEmpty: boolean
  title: string
  savedAt: Date | null
  playtimeMinutes: number
  /** Units currently in the active roster (first few, for a quick "is this the right slot" check). */
  units: UnitSummary[]
  /** Distinct item ids with a non-zero count. */
  inventoryKinds: number
}

export function slotOffset(slot: number): number {
  if (!Number.isInteger(slot) || slot < 0 || slot >= SLOT_COUNT) throw new RangeError(`Bad slot ${slot}.`)
  return HEADER_SIZE + slot * SLOT_SIZE
}

function dv(b: Uint8Array): DataView {
  return new DataView(b.buffer, b.byteOffset, b.byteLength)
}

function asciiZ(b: Uint8Array, start: number, maxLen: number): string {
  let end = start
  while (end < start + maxLen && b[end] !== 0) end++
  let s = ''
  for (let i = start; i < end; i++) {
    const c = b[i]
    s += c >= 0x20 && c < 0x7f ? String.fromCharCode(c) : '?'
  }
  return s.trim()
}

/** Throws with a user-facing message if this is not a manual-save payload we know how to edit. */
export function validateSave(bytes: Uint8Array): void {
  if (bytes.length < HEADER_SIZE) throw new Error('Save payload is too small.')
  if (dv(bytes).getBigUint64(0x08, true) === RESUME_DISCRIMINATOR) {
    throw new Error('This is a resume (in-battle / world map) save, not the manual save list. Open enhanced.png.')
  }
  if (bytes.length !== SAVE_SIZE) {
    throw new Error(`Unexpected save size ${bytes.length.toLocaleString()} bytes (expected ${SAVE_SIZE.toLocaleString()}). The game version may use a layout this editor does not know.`)
  }
}

export function storedChecksum(bytes: Uint8Array): number {
  return dv(bytes).getUint32(0x04, true)
}

export function computeChecksum(bytes: Uint8Array): number {
  return crc32(bytes, HEADER_SIZE, bytes.length)
}

/** Recompute the header CRC-32 in place. Must be called after any edit. */
export function finalizeSave(bytes: Uint8Array): Uint8Array {
  dv(bytes).setUint32(0x04, computeChecksum(bytes), true)
  return bytes
}

export function isSlotEmpty(bytes: Uint8Array, slot: number): boolean {
  return dv(bytes).getUint16(slotOffset(slot) + SLOT_MAGIC_OFFSET, true) === 0
}

function unitName(bytes: Uint8Array, u: number): string {
  const nick = asciiZ(bytes, u + UNIT_NICKNAME, UNIT_NICKNAME_LENGTH)
  if (nick) return nick
  const nameNo = dv(bytes).getUint16(u + UNIT_NAME_NO, true)
  return CHARA_NAMES[nameNo] ?? `Unit ${bytes[u + UNIT_CHARACTER]}`
}

export function readUnits(bytes: Uint8Array, slot: number, limit = UNIT_COUNT): UnitSummary[] {
  const base = slotOffset(slot) + SLOT_UNITS_OFFSET
  const out: UnitSummary[] = []
  for (let i = 0; i < UNIT_COUNT && out.length < limit; i++) {
    const u = base + i * UNIT_SIZE
    if (bytes[u + UNIT_CHARACTER] === 0) continue // empty record
    if (bytes[u + UNIT_INDEX] !== i) continue // departed / stowed / guest not in roster
    out.push({
      index: i,
      name: unitName(bytes, u),
      job: JOB_NAMES[bytes[u + UNIT_JOB]] ?? `Job ${bytes[u + UNIT_JOB]}`,
      level: bytes[u + UNIT_LEVEL],
      brave: bytes[u + UNIT_BRAVE],
      faith: bytes[u + UNIT_FAITH],
    })
  }
  return out
}

/** Copy of the 261-byte party inventory (index == item id, value == count). */
export function readInventory(bytes: Uint8Array, slot: number): Uint8Array {
  const o = slotOffset(slot) + SLOT_INVENTORY_OFFSET
  return bytes.slice(o, o + INVENTORY_SIZE)
}

/** Overwrite the party inventory. Does NOT fix the checksum; call finalizeSave afterwards. */
export function writeInventory(bytes: Uint8Array, slot: number, counts: Uint8Array): void {
  if (counts.length !== INVENTORY_SIZE) throw new RangeError(`Inventory must be ${INVENTORY_SIZE} bytes.`)
  bytes.set(counts, slotOffset(slot) + SLOT_INVENTORY_OFFSET)
}

export function readSlot(bytes: Uint8Array, slot: number): SlotSummary {
  const base = slotOffset(slot)
  if (isSlotEmpty(bytes, slot)) {
    return { index: slot, isEmpty: true, title: '', savedAt: null, playtimeMinutes: 0, units: [], inventoryKinds: 0 }
  }
  const d = dv(bytes)
  const ts = d.getInt32(base + SLOT_TIMESTAMP_OFFSET, true)
  const inv = readInventory(bytes, slot)
  let kinds = 0
  for (let i = 1; i < inv.length; i++) if (inv[i] > 0) kinds++
  return {
    index: slot,
    isEmpty: false,
    title: asciiZ(bytes, base + SLOT_TITLE_OFFSET, SLOT_TITLE_LENGTH),
    savedAt: ts > 0 ? new Date(ts * 1000) : null,
    playtimeMinutes: d.getInt32(base + SLOT_PLAYTIME_OFFSET, true),
    units: readUnits(bytes, slot, 8),
    inventoryKinds: kinds,
  }
}

export function readSlots(bytes: Uint8Array): SlotSummary[] {
  validateSave(bytes)
  const out: SlotSummary[] = []
  for (let i = 0; i < SLOT_COUNT; i++) out.push(readSlot(bytes, i))
  return out
}
