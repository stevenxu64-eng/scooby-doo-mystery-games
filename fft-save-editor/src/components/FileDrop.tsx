import { useCallback, useRef, useState, type DragEvent } from 'react'
import { FileUp } from 'lucide-react'

interface Props {
  onFile: (name: string, bytes: Uint8Array) => void
  busy: boolean
}

export function FileDrop({ onFile, busy }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)

  const take = useCallback(
    async (file: File | undefined) => {
      if (!file) return
      const buf = await file.arrayBuffer()
      onFile(file.name, new Uint8Array(buf))
    },
    [onFile],
  )

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setOver(false)
    void take(e.dataTransfer.files[0])
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Choose your enhanced.png save file"
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click() }}
      onDragOver={(e) => { e.preventDefault(); setOver(true) }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
      className={`panel flex cursor-pointer flex-col items-center gap-3 px-6 py-10 text-center transition ${over ? 'ring-4 ring-amber-400/60' : ''} ${busy ? 'opacity-60' : ''}`}
    >
      <FileUp className="h-10 w-10 text-amber-300" aria-hidden />
      <div className="text-lg font-bold">Drop <code>enhanced.png</code> here, or click to browse</div>
      <div className="text-sm text-stone-400">
        The file never leaves your device. Everything runs in this browser tab.
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".png,image/png"
        className="hidden"
        onChange={(e) => { void take(e.target.files?.[0]); e.target.value = '' }}
      />
    </div>
  )
}
