import { describe, expect, it } from 'vitest'
import { crc32 } from '../crc32.ts'
import { buildChunk, extractChunk, listChunks, replaceChunk, chunkCrcValid, PNG_SIGNATURE } from '../png.ts'
import { packUmif, peekFileCount, unpackUmif, xorCrypt, XOR_KEY } from '../umif.ts'
import { getCompressDict } from '../dict.ts'

describe('crc32', () => {
  it('matches known vectors', () => {
    expect(crc32(new TextEncoder().encode('123456789'))).toBe(0xcbf43926)
    expect(crc32(new Uint8Array(0))).toBe(0)
    expect(crc32(new TextEncoder().encode('The quick brown fox jumps over the lazy dog'))).toBe(0x414fa339)
  })
  it('honours start/end', () => {
    const b = new TextEncoder().encode('xx123456789yy')
    expect(crc32(b, 2, 11)).toBe(0xcbf43926)
  })
})

describe('preset dictionary', () => {
  it('is 32 KB with the expected CRC-32 and Adler-32', () => {
    const d = getCompressDict()
    expect(d.length).toBe(0x8000)
    expect(crc32(d)).toBe(0x2c96dd9f)
    let a = 1, b = 0
    for (const x of d) { a = (a + x) % 65521; b = (b + a) % 65521 }
    expect(((b << 16) | a) >>> 0).toBe(0x4dafcb9c)
  })
})

describe('xorCrypt', () => {
  it('is an involution and uses the 8-byte key from index 0', () => {
    const src = Uint8Array.from({ length: 13 }, (_, i) => i * 7)
    const enc = xorCrypt(src.slice())
    for (let i = 0; i < src.length; i++) expect(enc[i]).toBe(src[i] ^ XOR_KEY[i % 8])
    expect(xorCrypt(enc.slice())).toEqual(src)
  })
})

function makePng(chunks: Array<[string, Uint8Array]>): Uint8Array {
  const parts = [PNG_SIGNATURE, ...chunks.map(([t, d]) => buildChunk(t, d)), buildChunk('IEND', new Uint8Array(0))]
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0))
  let o = 0
  for (const p of parts) { out.set(p, o); o += p.length }
  return out
}

describe('png chunks', () => {
  const ihdr = new Uint8Array(13)
  it('lists, extracts and validates chunks', () => {
    const png = makePng([['IHDR', ihdr], ['ffTo', new Uint8Array([1, 2, 3])], ['IDAT', new Uint8Array(5)]])
    const chunks = listChunks(png)
    expect(chunks.map((c) => c.type)).toEqual(['IHDR', 'ffTo', 'IDAT', 'IEND'])
    expect(chunks.every((c) => chunkCrcValid(png, c))).toBe(true)
    expect(Array.from(extractChunk(png, 'ffTo')!)).toEqual([1, 2, 3])
  })
  it('replaces one chunk and leaves the rest identical', () => {
    const png = makePng([['IHDR', ihdr], ['ffTo', new Uint8Array([1, 2, 3])], ['IDAT', new Uint8Array(5)]])
    const out = replaceChunk(png, 'ffTo', new Uint8Array([9, 9, 9, 9, 9, 9]))
    expect(Array.from(extractChunk(out, 'ffTo')!)).toEqual([9, 9, 9, 9, 9, 9])
    expect(out.length).toBe(png.length + 3)
    const a = listChunks(png), b = listChunks(out)
    expect(b.map((c) => c.type)).toEqual(a.map((c) => c.type))
    expect(Array.from(out.subarray(0, a[1].start))).toEqual(Array.from(png.subarray(0, a[1].start)))
    expect(Array.from(out.subarray(b[2].start))).toEqual(Array.from(png.subarray(a[2].start)))
    expect(b.every((c) => chunkCrcValid(out, c))).toBe(true)
  })
})

describe('umif container', () => {
  it('round-trips a file through pack/unpack', () => {
    const data = new Uint8Array(100_000)
    for (let i = 0; i < data.length; i++) data[i] = (i * 31 + (i >> 8)) & 0xff
    const chunk = packUmif([{ name: 'fftsave.bin', data }])
    expect(peekFileCount(chunk)).toBe(1)
    const dv = new DataView(chunk.buffer)
    expect(dv.getUint32(0x08, true)).toBe(0x46494d55)
    expect(dv.getUint32(0x00, true)).toBe(0x30)
    // name is stored encrypted at 0x30, 12 bytes incl. NUL, then aligned to 4
    expect(dv.getUint32(0x10, true)).toBe(12)
    expect(Number(dv.getBigInt64(0x18, true))).toBe(0x30)
    expect(Number(dv.getBigInt64(0x28, true))).toBe(0x30 + 12)
    const [e] = unpackUmif(chunk)
    expect(e.name).toBe('fftsave.bin')
    expect(e.data).toEqual(data)
  })
  it('round-trips several files and odd lengths', () => {
    const files = [
      { name: 'a', data: Uint8Array.from([1]) },
      { name: 'longer-name.bin', data: Uint8Array.from({ length: 4097 }, (_, i) => i & 0xff) },
      { name: 'zeros', data: new Uint8Array(70_000) },
    ]
    const back = unpackUmif(packUmif(files))
    expect(back.map((f) => f.name)).toEqual(files.map((f) => f.name))
    back.forEach((f, i) => expect(f.data).toEqual(files[i].data))
  })
})
