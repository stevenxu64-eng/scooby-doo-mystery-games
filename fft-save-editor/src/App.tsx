import { useCallback, useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, Download, ShieldAlert, Swords } from 'lucide-react'
import { FileDrop } from './components/FileDrop.tsx'
import { SlotList } from './components/SlotList.tsx'
import { GrantPanel } from './components/GrantPanel.tsx'
import { useGrantPlan } from './hooks/useGrantPlan.ts'
import { Instructions } from './components/Instructions.tsx'
import { buildPng, loadSavePng, type LoadedSave } from './format/editor.ts'
import { readInventory, writeInventory } from './format/save.ts'
import { EQUIPMENT_CATEGORIES, type GrantOptions } from './format/equipment.ts'

const DEFAULT_OPTIONS: GrantOptions = {
  count: 99,
  categories: new Set(EQUIPMENT_CATEGORIES),
  neverLower: true,
  onlyMissing: false,
}

interface Result {
  fileName: string
  bytes: Uint8Array
  changed: number
  verified: boolean
}

export default function App() {
  const [fileName, setFileName] = useState<string | null>(null)
  const [loaded, setLoaded] = useState<LoadedSave | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [options, setOptions] = useState<GrantOptions>(DEFAULT_OPTIONS)
  const [result, setResult] = useState<Result | null>(null)
  const [busy, setBusy] = useState(false)

  const onFile = useCallback((name: string, bytes: Uint8Array) => {
    setBusy(true)
    setError(null)
    setResult(null)
    setLoaded(null)
    setSelected(null)
    setFileName(name)
    try {
      const l = loadSavePng(bytes)
      setLoaded(l)
      const filled = l.slots.filter((s) => !s.isEmpty)
      if (filled.length > 0) {
        const newest = filled.reduce((a, b) => ((b.savedAt?.getTime() ?? 0) > (a.savedAt?.getTime() ?? 0) ? b : a))
        setSelected(newest.index)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }, [])

  const inventory = useMemo(
    () => (loaded && selected !== null ? readInventory(loaded.save, selected) : null),
    [loaded, selected],
  )
  const plan = useGrantPlan(inventory, options)

  const apply = () => {
    if (!loaded || selected === null || !plan) return
    setBusy(true)
    setError(null)
    try {
      const edited = loaded.save.slice()
      writeInventory(edited, selected, plan.next)
      const bytes = buildPng(loaded, edited)
      // Re-open what we just built: proves the container round-trips and the checksum is right.
      const check = loadSavePng(bytes)
      const back = readInventory(check.save, selected)
      const verified = check.checksumMatched && back.every((v, i) => v === plan.next[i])
      setResult({ fileName: fileName ?? 'enhanced.png', bytes, changed: plan.changes.length, verified })
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  const download = () => {
    if (!result) return
    const blob = new Blob([result.bytes as BlobPart], { type: 'image/png' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'enhanced.png'
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 10_000)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-8 text-center">
        <Swords className="mx-auto h-12 w-12 text-amber-300" aria-hidden />
        <h1 className="mt-2 text-3xl font-black uppercase tracking-widest text-amber-300 sm:text-4xl">Ivalice Chronicles Save Editor</h1>
        <p className="mt-2 text-stone-400">
          Give your party every piece of equipment in <em>FINAL FANTASY TACTICS – The Ivalice Chronicles</em> (Steam / Steam Deck).
          Runs entirely in your browser.
        </p>
      </header>

      <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-700/60 bg-amber-950/40 p-3 text-sm text-amber-100">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
        <div><strong>Back up your save folder first</strong> and turn off Steam Cloud for the game before replacing the file. See the notes at the bottom for the Steam Deck path.</div>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 flex items-center gap-2 text-xl font-bold"><span className="step-num">1</span> Load your save</h2>
        <FileDrop onFile={onFile} busy={busy} />
        {error && (
          <div role="alert" className="mt-3 flex items-start gap-2 rounded-lg border border-red-800 bg-red-950/50 p-3 text-sm text-red-100">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden /> <span>{error}</span>
          </div>
        )}
        {loaded && (
          <div className="mt-3 text-sm text-stone-300">
            Loaded <code>{fileName}</code>: {loaded.slots.filter((s) => !s.isEmpty).length} of 50 slots in use.{' '}
            {loaded.checksumMatched
              ? <span className="text-emerald-300">Checksum verified, so the file was decoded correctly.</span>
              : <span className="text-amber-300">Stored checksum did not match. The file may be from a game version this editor does not fully understand; proceed only if you have a backup.</span>}
          </div>
        )}
      </section>

      {loaded && (
        <section className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 text-xl font-bold"><span className="step-num">2</span> Pick the slot you play on</h2>
          <SlotList slots={loaded.slots} selected={selected} onSelect={(i) => { setSelected(i); setResult(null) }} />
        </section>
      )}

      {loaded && inventory && (
        <section className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 text-xl font-bold"><span className="step-num">3</span> Choose what to add</h2>
          <div className="panel p-4">
            <GrantPanel inventory={inventory} options={options} onChange={(o) => { setOptions(o); setResult(null) }} />
          </div>
        </section>
      )}

      {loaded && inventory && plan && (
        <section className="mb-10">
          <h2 className="mb-3 flex items-center gap-2 text-xl font-bold"><span className="step-num">4</span> Apply and download</h2>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="btn" onClick={apply} disabled={busy || plan.changes.length === 0}>
              <Swords className="h-4 w-4" aria-hidden /> Apply to slot {selected !== null ? selected + 1 : ''}
            </button>
            {result && (
              <button type="button" className="btn btn-secondary" onClick={download}>
                <Download className="h-4 w-4" aria-hidden /> Download enhanced.png
              </button>
            )}
          </div>
          {result && (
            <div className={`mt-3 flex items-start gap-2 rounded-lg border p-3 text-sm ${result.verified ? 'border-emerald-800 bg-emerald-950/40 text-emerald-100' : 'border-red-800 bg-red-950/50 text-red-100'}`}>
              {result.verified ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden /> : <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />}
              <div>
                {result.verified
                  ? <>Patched {result.changed} items and re-read the new file successfully. Download it, then replace <code>enhanced.png</code> in your save folder.</>
                  : <>The rebuilt file did not verify. Do not use it. Please report this with your game version.</>}
              </div>
            </div>
          )}
        </section>
      )}

      <section className="panel p-5">
        <h2 className="mb-3 text-xl font-bold text-amber-200">Steam Deck notes</h2>
        <Instructions />
      </section>

      <footer className="mt-8 text-center text-xs leading-6 text-stone-500">
        Fan-made tool, not affiliated with Square Enix. Container format from{' '}
        <a className="underline" href="https://github.com/Nenkai/FF16Tools">Nenkai/FF16Tools</a> (MIT); save layout from community
        research including <a className="underline" href="https://github.com/Nelveska/TICSaveEditor">TICSaveEditor</a>. Use at your own risk.
      </footer>
    </div>
  )
}
