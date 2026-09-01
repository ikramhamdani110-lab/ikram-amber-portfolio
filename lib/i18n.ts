import type { Language } from '@/lib/translations'

/** A field that carries both English and Arabic text. */
export type Localized = { en: string; ar: string }

/**
 * Render boundary (public site). Tolerates BOTH the {en,ar} shape and legacy
 * plain strings, so nothing crashes while data is being migrated. Falls back
 * across languages so a half-filled field never renders empty.
 */
export function pickLocale(
  v: Localized | string | null | undefined,
  lang: Language,
): string {
  if (v == null) return ''
  if (typeof v === 'string') return v
  return v[lang] || v.en || v.ar || ''
}

/**
 * Edit boundary (admin). Coerces anything into a full {en,ar} pair so the
 * paired inputs always have both values to bind to.
 */
export function toLocalized(
  v: Localized | string | null | undefined,
): Localized {
  if (v == null) return { en: '', ar: '' }
  if (typeof v === 'string') return { en: v, ar: '' }
  return { en: v.en || '', ar: v.ar || '' }
}

/** True when a Localized/legacy value has no text in either language. */
export function isLocalizedEmpty(v: Localized | string | null | undefined): boolean {
  if (v == null) return true
  if (typeof v === 'string') return v.trim() === ''
  return (v.en || '').trim() === '' && (v.ar || '').trim() === ''
}
