import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/creepster/index.css'
import '@fontsource-variable/baloo-2/index.css'
import './index.css'
import App from './App.tsx'
import { useGameStore } from './store/gameStore.ts'

if (import.meta.env.DEV) {
  // Debug/test hook: inspect state from the console, e.g. __store.getState()
  ;(window as unknown as { __store: typeof useGameStore }).__store = useGameStore
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
