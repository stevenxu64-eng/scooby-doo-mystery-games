import { useMemo } from 'react'
import { planGrant, type GrantOptions } from '../format/equipment.ts'

export function useGrantPlan(inventory: Uint8Array | null, options: GrantOptions) {
  return useMemo(() => (inventory ? planGrant(inventory, options) : null), [inventory, options])
}
