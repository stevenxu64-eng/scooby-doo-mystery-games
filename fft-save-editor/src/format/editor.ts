// High-level open / patch / save pipeline: PNG -> ffTo chunk -> UMIF -> fftsave.bin and back.
import { FFTO_CHUNK_TYPE, extractChunk, isPng, replaceChunk } from './png.ts'
import { DEFAULT_INNER_FILENAME, packUmif, peekFileCount, unpackUmif } from './umif.ts'
import { computeChecksum, finalizeSave, readSlots, storedChecksum, validateSave, type SlotSummary } from './save.ts'

export interface LoadedSave {
  /** Original PNG bytes, untouched. */
  png: Uint8Array
  /** Inner file name inside the container (normally "fftsave.bin"). */
  innerName: string
  /** Decompressed fftsave.bin; edit this, then call buildPng. */
  save: Uint8Array
  /** Whether the checksum stored in the file matched what we compute (a strong "we parsed it right" signal). */
  checksumMatched: boolean
  slots: SlotSummary[]
}

export function loadSavePng(png: Uint8Array): LoadedSave {
  if (!isPng(png)) throw new Error('That is not a PNG file. Pick enhanced.png from the game\'s save folder.')
  const chunk = extractChunk(png, FFTO_CHUNK_TYPE)
  if (!chunk) throw new Error('This PNG has no save data in it (no "ffTo" chunk). Is it a screenshot rather than a save?')
  const n = peekFileCount(chunk)
  if (n !== 1) {
    throw new Error(`This container holds ${n} files, which is the autosave / in-battle history format (autoenhanced.png). Open enhanced.png, the manual save list.`)
  }
  const [entry] = unpackUmif(chunk)
  validateSave(entry.data)
  return {
    png,
    innerName: entry.name || DEFAULT_INNER_FILENAME,
    save: entry.data,
    checksumMatched: storedChecksum(entry.data) === computeChecksum(entry.data),
    slots: readSlots(entry.data),
  }
}

/** Fix the checksum, re-pack the container, and splice it into the original PNG. */
export function buildPng(loaded: LoadedSave, save: Uint8Array = loaded.save): Uint8Array {
  finalizeSave(save)
  const chunk = packUmif([{ name: loaded.innerName, data: save }])
  return replaceChunk(loaded.png, FFTO_CHUNK_TYPE, chunk)
}
