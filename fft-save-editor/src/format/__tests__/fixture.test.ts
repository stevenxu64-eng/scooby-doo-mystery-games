// Real-save checks. They run only when fixtures/enhanced.png exists (a copy of a real Steam save).
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { chunkCrcValid, extractChunk, findChunk, listChunks, FFTO_CHUNK_TYPE } from '../png.ts'
import { packUmif, peekFileCount, unpackUmif } from '../umif.ts'
import {
  INVENTORY_SIZE, SAVE_SIZE, SLOT_INVENTORY_OFFSET, computeChecksum, readInventory, slotOffset,
  storedChecksum, writeInventory,
} from '../save.ts'
import { buildPng, loadSavePng } from '../editor.ts'
import { EQUIPMENT_CATEGORIES, planGrant } from '../equipment.ts'

const FIXTURE = fileURLToPath(new URL('../../../fixtures/enhanced.png', import.meta.url))
const have = existsSync(FIXTURE)

describe.skipIf(!have)('real enhanced.png fixture', () => {
  const png = have ? new Uint8Array(readFileSync(FIXTURE)) : new Uint8Array(0)

  it('is a PNG with a valid ffTo chunk holding one file', () => {
    const chunks = listChunks(png)
    expect(chunks.map((c) => c.type)).toContain(FFTO_CHUNK_TYPE)
    expect(chunks.every((c) => chunkCrcValid(png, c))).toBe(true)
    expect(peekFileCount(extractChunk(png, FFTO_CHUNK_TYPE)!)).toBe(1)
  })

  it('unpacks to fftsave.bin of the known size with a matching checksum', () => {
    const [entry] = unpackUmif(extractChunk(png, FFTO_CHUNK_TYPE)!)
    expect(entry.name).toBe('fftsave.bin')
    expect(entry.data.length).toBe(SAVE_SIZE)
    expect(storedChecksum(entry.data)).toBe(computeChecksum(entry.data))
  })

  it('parses populated slots with plausible fields', () => {
    const loaded = loadSavePng(png)
    expect(loaded.checksumMatched).toBe(true)
    const filled = loaded.slots.filter((s) => !s.isEmpty)
    expect(filled.length).toBeGreaterThan(0)
    for (const s of filled) {
      expect(s.savedAt).not.toBeNull()
      expect(s.savedAt!.getFullYear()).toBeGreaterThanOrEqual(2025)
      expect(s.playtimeMinutes).toBeGreaterThanOrEqual(0)
      expect(s.units.length).toBeGreaterThan(0)
      for (const u of s.units) {
        expect(u.level).toBeGreaterThanOrEqual(1)
        expect(u.level).toBeLessThanOrEqual(99)
        expect(u.brave).toBeLessThanOrEqual(100)
        expect(u.faith).toBeLessThanOrEqual(100)
      }
      // A real inventory never holds "Nothing Equipped" or the blank ids.
      const inv = readInventory(loaded.save, s.index)
      expect(inv[0]).toBe(0)
      expect(inv[254]).toBe(0)
      expect(inv[255]).toBe(0)
      expect(s.inventoryKinds).toBeGreaterThan(0)
    }
    // eslint-disable-next-line no-console
    console.log(filled.map((s) => `slot ${s.index + 1}: "${s.title}" ${s.savedAt?.toISOString()} ${s.playtimeMinutes}min kinds=${s.inventoryKinds} units=${s.units.map((u) => `${u.name}/L${u.level}/${u.job}`).join(',')}`).join('\n'))
  })

  it('re-packs to a container that unpacks byte-identically', () => {
    const [entry] = unpackUmif(extractChunk(png, FFTO_CHUNK_TYPE)!)
    const [again] = unpackUmif(packUmif([entry]))
    expect(again.name).toBe(entry.name)
    expect(again.data).toEqual(entry.data)
  })

  it('an inventory edit changes only the inventory bytes and the checksum', () => {
    const loaded = loadSavePng(png)
    const slot = loaded.slots.filter((s) => !s.isEmpty)[0].index
    const edited = loaded.save.slice()
    const plan = planGrant(readInventory(edited, slot), { count: 99, categories: EQUIPMENT_CATEGORIES, neverLower: true, onlyMissing: false })
    expect(plan.changes.length).toBeGreaterThan(0)
    writeInventory(edited, slot, plan.next)
    const out = buildPng(loaded, edited)

    // PNG: every non-ffTo chunk is bit-identical to the original.
    const a = listChunks(png), b = listChunks(out)
    expect(b.map((c) => c.type)).toEqual(a.map((c) => c.type))
    const fa = findChunk(png, FFTO_CHUNK_TYPE)!, fb = findChunk(out, FFTO_CHUNK_TYPE)!
    expect(out.subarray(0, fb.start)).toEqual(png.subarray(0, fa.start))
    expect(out.subarray(fb.end)).toEqual(png.subarray(fa.end))

    const back = loadSavePng(out)
    expect(back.checksumMatched).toBe(true)
    const lo = slotOffset(slot) + SLOT_INVENTORY_OFFSET, hi = lo + INVENTORY_SIZE
    let diffs = 0
    for (let i = 0x10; i < SAVE_SIZE; i++) {
      if (back.save[i] !== loaded.save[i]) {
        diffs++
        if (i < lo || i >= hi) throw new Error(`unexpected change at byte 0x${i.toString(16)}`)
      }
    }
    expect(diffs).toBe(plan.changes.length)
    expect(readInventory(back.save, slot)).toEqual(plan.next)
  })
})
