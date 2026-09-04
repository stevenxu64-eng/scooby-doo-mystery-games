// Minimal PNG chunk walker. Steam saves for The Ivalice Chronicles are real PNGs whose payload
// lives in a private chunk of type "ffTo". We never decode the image; we only find and replace
// that one chunk, leaving every other chunk (including the thumbnail) byte-for-byte intact.
import { crc32 } from './crc32.ts'

export const PNG_SIGNATURE = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
export const FFTO_CHUNK_TYPE = 'ffTo'

export interface PngChunk {
  type: string
  /** offset of the 4-byte length field */
  start: number
  /** offset of the first data byte */
  dataStart: number
  dataLength: number
  /** offset just past the CRC */
  end: number
}

export function isPng(bytes: Uint8Array): boolean {
  if (bytes.length < 8) return false
  for (let i = 0; i < 8; i++) if (bytes[i] !== PNG_SIGNATURE[i]) return false
  return true
}

function readU32BE(b: Uint8Array, o: number): number {
  return ((b[o] << 24) | (b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3]) >>> 0
}

function writeU32BE(b: Uint8Array, o: number, v: number): void {
  b[o] = (v >>> 24) & 0xff
  b[o + 1] = (v >>> 16) & 0xff
  b[o + 2] = (v >>> 8) & 0xff
  b[o + 3] = v & 0xff
}

function chunkTypeAt(b: Uint8Array, o: number): string {
  return String.fromCharCode(b[o], b[o + 1], b[o + 2], b[o + 3])
}

export function listChunks(bytes: Uint8Array): PngChunk[] {
  if (!isPng(bytes)) throw new Error('Not a PNG file (bad signature).')
  const chunks: PngChunk[] = []
  let pos = 8
  while (pos + 8 <= bytes.length) {
    const len = readU32BE(bytes, pos)
    const type = chunkTypeAt(bytes, pos + 4)
    const end = pos + 8 + len + 4
    if (end > bytes.length) throw new Error(`Truncated PNG chunk "${type}" at offset ${pos}.`)
    chunks.push({ type, start: pos, dataStart: pos + 8, dataLength: len, end })
    pos = end
    if (type === 'IEND') break
  }
  return chunks
}

export function findChunk(bytes: Uint8Array, type: string): PngChunk | null {
  return listChunks(bytes).find((c) => c.type === type) ?? null
}

/** Returns a view (not a copy) of the chunk's data, or null if absent. */
export function extractChunk(bytes: Uint8Array, type: string): Uint8Array | null {
  const c = findChunk(bytes, type)
  return c ? bytes.subarray(c.dataStart, c.dataStart + c.dataLength) : null
}

/** Encode one chunk: length, type, data, CRC-32 over type+data. */
export function buildChunk(type: string, data: Uint8Array): Uint8Array {
  if (type.length !== 4) throw new Error('Chunk type must be 4 characters.')
  const out = new Uint8Array(12 + data.length)
  writeU32BE(out, 0, data.length)
  for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i)
  out.set(data, 8)
  writeU32BE(out, 8 + data.length, crc32(out, 4, 8 + data.length))
  return out
}

/** Replace the data of an existing chunk in place; all other bytes are preserved verbatim. */
export function replaceChunk(bytes: Uint8Array, type: string, data: Uint8Array): Uint8Array {
  const c = findChunk(bytes, type)
  if (!c) throw new Error(`PNG has no "${type}" chunk.`)
  const chunk = buildChunk(type, data)
  const out = new Uint8Array(bytes.length - (c.end - c.start) + chunk.length)
  out.set(bytes.subarray(0, c.start), 0)
  out.set(chunk, c.start)
  out.set(bytes.subarray(c.end), c.start + chunk.length)
  return out
}

/** Verify the stored CRC of a chunk (useful as a sanity check on load). */
export function chunkCrcValid(bytes: Uint8Array, c: PngChunk): boolean {
  const stored = readU32BE(bytes, c.dataStart + c.dataLength)
  return stored === crc32(bytes, c.start + 4, c.dataStart + c.dataLength)
}
