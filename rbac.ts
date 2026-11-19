/** Roles & module permissions */
export const ROLES = ['ADMIN', 'MANAGER', 'BROKER', 'ACCOUNTANT', 'DATA_ENTRY'] as const
export type Role = (typeof ROLES)[number]

export const ROLE_LABELS: Record<string, { ar: string; en: string }> = {
  ADMIN: { ar: 'مدير النظام', en: 'Admin' },
  MANAGER: { ar: 'مدير', en: 'Manager' },
  BROKER: { ar: 'مخلص جمركي', en: 'Customs Broker' },
  ACCOUNTANT: { ar: 'محاسب', en: 'Accountant' },
  DATA_ENTRY: { ar: 'مدخل بيانات', en: 'Data Entry' },
}

export const MODULES = [
  'dashboard', 'shipments', 'clients', 'documents', 'imageEditor', 'hs', 'accounting', 'tasks', 'reports', 'templates', 'settings',
] as const

const PERMISSIONS: Record<Role, string[]> = {
  ADMIN: [...MODULES],
  MANAGER: ['dashboard', 'shipments', 'clients', 'documents', 'imageEditor', 'hs', 'accounting', 'tasks', 'reports', 'templates', 'settings'],
  BROKER: ['dashboard', 'shipments', 'clients', 'documents', 'imageEditor', 'hs', 'tasks', 'reports', 'templates'],
  ACCOUNTANT: ['dashboard', 'clients', 'shipments', 'documents', 'imageEditor', 'hs', 'accounting', 'tasks', 'reports', 'templates'],
  DATA_ENTRY: ['dashboard', 'shipments', 'clients', 'documents', 'imageEditor', 'hs', 'tasks', 'templates'],
}

export function can(role: string, module: string): boolean {
  const perms = PERMISSIONS[role as Role]
  return !!perms && perms.includes(module)
}

/** Write-permission guards (read permission is broader) */
export const WRITE_GUARDS: Record<string, string[]> = {
  users: ['ADMIN'],
  shipments: ['ADMIN', 'MANAGER', 'BROKER', 'DATA_ENTRY'],
  clients: ['ADMIN', 'MANAGER', 'BROKER', 'DATA_ENTRY'],
  documents: ['ADMIN', 'MANAGER', 'BROKER', 'ACCOUNTANT', 'DATA_ENTRY'],
  accounting: ['ADMIN', 'MANAGER', 'ACCOUNTANT'],
  hs: ['ADMIN', 'MANAGER', 'BROKER'],
  tasks: ['ADMIN', 'MANAGER', 'BROKER', 'ACCOUNTANT', 'DATA_ENTRY'],
  settings: ['ADMIN', 'MANAGER'],
  templates: ['ADMIN', 'MANAGER', 'BROKER', 'DATA_ENTRY'],
}
