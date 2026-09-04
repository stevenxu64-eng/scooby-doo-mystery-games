// The "UMIF" container stored inside the PNG's ffTo chunk. Format (all little-endian):
//
//   0x00 u32 tocSize = 0x10 + numFiles*0x20     0x04 u32 0
//   0x08 u32 magic 0x46494D55 ("UMIF")           0x0C u32 numFiles
//   entry i at 0x10 + i*0x20:
//     +0x00 u32 nameLength (incl. NUL)   +0x04 u32 dataLength
//     +0x08 i64 namePtr                  +0x10 i64 decompressedLength   +0x18 i64 dataPtr
//
// Names and data blobs are XOR-obfuscated with an 8-byte repeating key. Data is a zlib stream
// with its 2-byte header stripped, compressed against a 32 KB preset dictionary.
// Spec derived from Nenkai/FF16Tools (MIT).
import { Inflate, deflate } from 'pako'
import { getCompressDict } from './dict.ts'

export const UMIF_MAGIC = 0x46494d55
export const MAIN_HEADER_SIZE = 0x10
export const FILE_ENTRY_SIZE = 0x20
export const XOR_KEY = new Uint8Array([0xf3, 0xc4, 0x1f, 0x5f, 0xfe, 0x80, 0x3f, 0x0f])
export const DEFAULT_INNER_FILENAME = 'fftsave.bin'

export interface UmifEntry {
  name: string
  data: Uint8Array
}

/** In-place XOR with the repeating 8-byte key. Symmetric: call once to encode, once to decode. */
export function xorCrypt(data: Uint8Array): Uint8Array {
  for (let i = 0; i < data.length; i++) data[i] ^= XOR_KEY[i & 7]
  return data
}

function view(b: Uint8Array): DataView {
  return new DataView(b.buffer, b.byteOffset, b.byteLength)
}

function readI64(dv: DataView, o: number): number {
  const v = dv.getBigInt64(o, true)
  if (v < 0n || v > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error(`Unreasonable 64-bit offset at ${o}.`)
  return Number(v)
}

export function peekFileCount(chunk: Uint8Array): number {
  if (chunk.length < MAIN_HEADER_SIZE) throw new Error('Container too small.')
  const dv = view(chunk)
  if (dv.getUint32(0x08, true) !== UMIF_MAGIC) throw new Error('Bad container magic (expected "UMIF").')
  return dv.getUint32(0x0c, true)
}

export function unpackUmif(chunk: Uint8Array): UmifEntry[] {
  const numFiles = peekFileCount(chunk)
  const dv = view(chunk)
  const dict = getCompressDict()
  const entries: UmifEntry[] = []
  for (let i = 0; i < numFiles; i++) {
    const e = MAIN_HEADER_SIZE + i * FILE_ENTRY_SIZE
    const nameLength = dv.getUint32(e + 0x00, true)
    const dataLength = dv.getUint32(e + 0x04, true)
    const namePtr = readI64(dv, e + 0x08)
    const decompressedLength = readI64(dv, e + 0x10)
    const dataPtr = readI64(dv, e + 0x18)
    if (namePtr + nameLength > chunk.length || dataPtr + dataLength > chunk.length) {
      throw new Error(`Container entry ${i} points outside the chunk.`)
    }

    const nameBytes = xorCrypt(chunk.slice(namePtr, namePtr + nameLength))
    const nul = nameBytes.indexOf(0)
    const name = new TextDecoder().decode(nul >= 0 ? nameBytes.subarray(0, nul) : nameBytes)

    // Re-add the zlib header the game strips: CMF 0x78 (deflate, 32K window), FLG 0xF9 (FDICT set).
    const zlibStream = new Uint8Array(2 + dataLength)
    zlibStream[0] = 0x78
    zlibStream[1] = 0xf9
    zlibStream.set(xorCrypt(chunk.slice(dataPtr, dataPtr + dataLength)), 2)
    const inflater = new Inflate({ dictionary: dict })
    inflater.push(zlibStream, true)
    if (inflater.err) throw new Error(`Could not decompress "${name}": ${inflater.msg || inflater.err}`)
    const data = inflater.result as Uint8Array
    if (data.length !== decompressedLength) {
      throw new Error(`"${name}" inflated to ${data.length} bytes, expected ${decompressedLength}.`)
    }
    entries.push({ name, data })
  }
  return entries
}

function align4(n: number): number {
  return (n + 3) & ~3
}

/** Compress + obfuscate one file the way the game does (header bytes stripped, 2 zero bytes counted). */
function compressEncrypt(plain: Uint8Array): Uint8Array {
  const z = deflate(plain, { level: 9, dictionary: getCompressDict() })
  if (z[0] !== 0x78 || z[1] !== 0xf9) throw new Error('Unexpected zlib header from deflate.')
  // Reference tool stores z.length bytes starting at z[2], i.e. the stream plus two zero bytes.
  const stored = new Uint8Array(z.length)
  stored.set(z.subarray(2), 0)
  return xorCrypt(stored)
}

export function packUmif(entries: UmifEntry[]): Uint8Array {
  const enc = new TextEncoder()
  const names = entries.map((e) => {
    const raw = enc.encode(e.name)
    const withNul = new Uint8Array(raw.length + 1)
    withNul.set(raw)
    return xorCrypt(withNul)
  })
  const blobs = entries.map((e) => compressEncrypt(e.data))

  const tocSize = MAIN_HEADER_SIZE + entries.length * FILE_ENTRY_SIZE
  let total = tocSize
  const namePtrs: number[] = []
  for (const n of names) {
    namePtrs.push(total)
    total = align4(total + n.length)
  }
  const dataPtrs: number[] = []
  for (const b of blobs) {
    dataPtrs.push(total)
    total += b.length + 1 // one explicit NUL after each blob
  }

  const out = new Uint8Array(total)
  const dv = view(out)
  dv.setUint32(0x00, tocSize, true)
  dv.setUint32(0x04, 0, true)
  dv.setUint32(0x08, UMIF_MAGIC, true)
  dv.setUint32(0x0c, entries.length, true)
  entries.forEach((e, i) => {
    const o = MAIN_HEADER_SIZE + i * FILE_ENTRY_SIZE
    dv.setUint32(o + 0x00, names[i].length, true)
    dv.setUint32(o + 0x04, blobs[i].length, true)
    dv.setBigInt64(o + 0x08, BigInt(namePtrs[i]), true)
    dv.setBigInt64(o + 0x10, BigInt(e.data.length), true)
    dv.setBigInt64(o + 0x18, BigInt(dataPtrs[i]), true)
    out.set(names[i], namePtrs[i])
    out.set(blobs[i], dataPtrs[i])
  })
  return out
}
