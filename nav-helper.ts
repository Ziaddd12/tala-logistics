'use client'

import { create } from 'zustand'
import { useApp, type ModuleKey } from '@/lib/store'

/** Cross-module navigation: open module + focused entity id */
type NavState = { focusId: string | null; navigate: (m: ModuleKey, id?: string) => void }

export const useNav = create<NavState>((set) => ({
  focusId: null,
  navigate: (m, id) => {
    set({ focusId: id || null })
    useApp.getState().setModule(m)
    useApp.getState().setCommandOpen(false)
  },
}))

/** Convenience hook returning a navigate function */
export function useRouterlessNav() {
  return useNav((s) => s.navigate)
}
