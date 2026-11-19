'use client'

import { create } from 'zustand'
import { t } from './i18n'
import type { Lang } from './i18n'

export type SessionUser = { id: string; email: string; name: string; role: string }
export type ModuleKey = 'dashboard' | 'shipments' | 'clients' | 'documents' | 'imageEditor' | 'hs' | 'accounting' | 'tasks' | 'reports' | 'templates' | 'settings'

type AppState = {
  lang: Lang
  user: SessionUser | null
  module: ModuleKey
  commandOpen: boolean
  setLang: (l: Lang) => void
  setUser: (u: SessionUser | null) => void
  setModule: (m: ModuleKey) => void
  setCommandOpen: (o: boolean) => void
}

function applyDir(lang: Lang) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }
}

const savedLang = (typeof window !== 'undefined' && (localStorage.getItem('tala-lang') as Lang)) || 'ar'
applyDir(savedLang)

export const useApp = create<AppState>((set) => ({
  lang: savedLang,
  user: null,
  module: 'dashboard',
  commandOpen: false,
  setLang: (l) => {
    localStorage.setItem('tala-lang', l)
    applyDir(l)
    set({ lang: l })
  },
  setUser: (u) => set({ user: u }),
  setModule: (m) => set({ module: m, commandOpen: false }),
  setCommandOpen: (o) => set({ commandOpen: o }),
}))

/** Hook: returns translate function bound to current language */
export function useT() {
  const lang = useApp((s) => s.lang)
  return (key: string) => t(key, lang)
}
