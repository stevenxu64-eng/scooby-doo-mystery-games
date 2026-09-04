import { describe, expect, it } from 'vitest'
import {
  HEADER_SIZE, INVENTORY_SIZE, SAVE_SIZE, SLOT_INVENTORY_OFFSET, SLOT_SIZE, SLOT_UNITS_OFFSET, UNIT_SIZE,
  computeChecksum, finalizeSave, readInventory, readSlots, slotOffset, storedChecksum, validateSave, writeInventory,
} from '../save.ts'
import { EQUIPMENT_ITEMS, CATEGORY_GROUPS, EQUIPMENT_CATEGORIES, planGrant } from '../equipment.ts'
import { ITEMS } from '../../data/items.ts'
import { buildPng, loadSavePng } from '../editor.ts'
import { buildChunk, PNG_SIGNATURE } from '../png.ts'
import { packUmif } from '../umif.ts'

function syntheticSave(): Uint8Array {
  const s = new Uint8Array(SAVE_SIZE)
  const dv = new DataView(s.buffer)
  dv.setUint32(0x00, 1, true)
  // slot 3: populated
  const b = slotOffset(3)
  s[b] = 0x53; s[b + 1] = 0x43 // "SC"
  s.set(new TextEncoder().encode('Chapter 2 - Zeirchele'), b + 0x04)
  dv.setInt32(b + 0x44, 1_760_000_000, true)
  dv.setInt32(b + 0x120, 1234, true)
  const u0 = b + SLOT_UNITS_OFFSET
  s[u0] = 1; s[u0 + 1] = 0; s[u0 + 2] = 1; s[u0 + 0x1d] = 42; s[u0 + 0x1e] = 70; s[u0 + 0x1f] = 60
  s.set(new TextEncoder().encode('Ramza'), u0 + 0xdc)
  const u1 = u0 + UNIT_SIZE
  s[u1] = 128; s[u1 + 1] = 1; s[u1 + 2] = 76; s[u1 + 0x1d] = 30
  dv.setUint16(u1 + 0x11c, 1022, true) // generic name lookup
  const u2 = u0 + 2 * UNIT_SIZE
  s[u2] = 5; s[u2 + 1] = 0xff // departed guest -> hidden
  s[b + SLOT_INVENTORY_OFFSET + 1] = 3 // 3 daggers
  s[b + SLOT_INVENTORY_OFFSET + 240] = 12 // 12 potions
  return finalizeSave(s)
}

describe('save layout', () => {
  it('constants agree with the known file size', () => {
    expect(SAVE_SIZE).toBe(2_007_816)
    expect(HEADER_SIZE + 50 * SLOT_SIZE).toBe(SAVE_SIZE)
    expect(SLOT_UNITS_OFFSET + 54 * UNIT_SIZE).toBe(SLOT_INVENTORY_OFFSET)
  })
  it('parses a synthetic slot', () => {
    const s = syntheticSave()
    validateSave(s)
    expect(storedChecksum(s)).toBe(computeChecksum(s))
    const slots = readSlots(s)
    expect(slots.filter((x) => !x.isEmpty).map((x) => x.index)).toEqual([3])
    const slot = slots[3]
    expect(slot.title).toBe('Chapter 2 - Zeirchele')
    expect(slot.savedAt?.getTime()).toBe(1_760_000_000 * 1000)
    expect(slot.playtimeMinutes).toBe(1234)
    expect(slot.inventoryKinds).toBe(2)
    expect(slot.units.map((u) => [u.name, u.job, u.level])).toEqual([
      ['Ramza', 'Squire', 42],
      ['Thaeox', 'Knight', 30],
    ])
  })
  it('rejects resume saves and wrong sizes', () => {
    const s = syntheticSave()
    new DataView(s.buffer).setBigUint64(0x08, 0x10n, true)
    expect(() => validateSave(s)).toThrow(/resume/)
    expect(() => validateSave(new Uint8Array(1000))).toThrow(/size/)
  })
  it('writes inventory and the checksum tracks it', () => {
    const s = syntheticSave()
    const before = storedChecksum(s)
    const inv = readInventory(s, 3)
    inv[19] = 99
    writeInventory(s, 3, inv)
    expect(storedChecksum(s)).toBe(before)
    expect(computeChecksum(s)).not.toBe(before)
    finalizeSave(s)
    expect(storedChecksum(s)).toBe(computeChecksum(s))
    expect(readInventory(s, 3)[19]).toBe(99)
  })
})

describe('item table', () => {
  it('has 261 contiguous ids', () => {
    expect(ITEMS.length).toBe(INVENTORY_SIZE)
    ITEMS.forEach((it, i) => expect(it.id).toBe(i))
    expect(ITEMS[1].name).toBe('Dagger')
    expect(ITEMS[35].name).toBe('Excalibur')
    expect(ITEMS[171].name).toBe('Ribbon')
    expect(ITEMS[260].name).toBe('Ring of Aptitude')
  })
  it('equipment excludes reserved ids and consumables', () => {
    const ids = new Set(EQUIPMENT_ITEMS.map((i) => i.id))
    for (const bad of [0, 254, 255, 240, 253, 122, 125]) expect(ids.has(bad)).toBe(false)
    for (const good of [1, 33, 35, 128, 171, 185, 236, 256, 260]) expect(ids.has(good)).toBe(true)
    expect(EQUIPMENT_ITEMS.length).toBe(238)
    const seen = new Set<string>()
    for (const g of CATEGORY_GROUPS) for (const c of g.categories) { expect(seen.has(c)).toBe(false); seen.add(c) }
  })
})

describe('planGrant', () => {
  it('raises only selected categories and never lowers by default', () => {
    const inv = new Uint8Array(INVENTORY_SIZE)
    inv[1] = 120 // more daggers than target
    inv[240] = 5 // potions, not equipment
    const plan = planGrant(inv, { count: 99, categories: EQUIPMENT_CATEGORIES, neverLower: true, onlyMissing: false })
    expect(plan.changes.length).toBe(237)
    expect(plan.next[1]).toBe(120)
    expect(plan.next[240]).toBe(5)
    expect(plan.next[0]).toBe(0); expect(plan.next[254]).toBe(0); expect(plan.next[255]).toBe(0)
    expect(plan.next[35]).toBe(99)
    expect(inv[35]).toBe(0) // input untouched
  })
  it('onlyMissing skips items already owned', () => {
    const inv = new Uint8Array(INVENTORY_SIZE)
    inv[19] = 1
    const plan = planGrant(inv, { count: 10, categories: new Set(['Sword']), neverLower: true, onlyMissing: true })
    expect(plan.changes.find((c) => c.id === 19)).toBeUndefined()
    expect(plan.changes.length).toBe(16 - 1 + 0) // 16 swords incl. 256/257; Broadsword skipped
  })
})

describe('end-to-end png', () => {
  it('loads, edits and rebuilds a synthetic enhanced.png', () => {
    const save = syntheticSave()
    const chunk = packUmif([{ name: 'fftsave.bin', data: save }])
    const parts = [PNG_SIGNATURE, buildChunk('IHDR', new Uint8Array(13)), chunk.length ? buildChunk('ffTo', chunk) : new Uint8Array(0), buildChunk('IDAT', new Uint8Array(40)), buildChunk('IEND', new Uint8Array(0))]
    const png = new Uint8Array(parts.reduce((n, p) => n + p.length, 0))
    let o = 0
    for (const p of parts) { png.set(p, o); o += p.length }

    const loaded = loadSavePng(png)
    expect(loaded.checksumMatched).toBe(true)
    expect(loaded.slots[3].title).toBe('Chapter 2 - Zeirchele')

    const edited = loaded.save.slice()
    const inv = readInventory(edited, 3)
    const plan = planGrant(inv, { count: 99, categories: EQUIPMENT_CATEGORIES, neverLower: true, onlyMissing: false })
    writeInventory(edited, 3, plan.next)
    const out = buildPng(loaded, edited)

    const again = loadSavePng(out)
    expect(again.checksumMatched).toBe(true)
    expect(readInventory(again.save, 3)[35]).toBe(99)
    expect(readInventory(again.save, 3)[240]).toBe(12)
    expect(again.slots[3].inventoryKinds).toBe(238 + 1)
    // everything outside the inventory bytes is identical
    const a = loaded.save, b = again.save
    for (let i = HEADER_SIZE; i < a.length; i++) {
      const inInv = i >= slotOffset(3) + SLOT_INVENTORY_OFFSET && i < slotOffset(3) + SLOT_INVENTORY_OFFSET + INVENTORY_SIZE
      if (!inInv && a[i] !== b[i]) throw new Error(`byte ${i} changed`)
    }
  })
})
