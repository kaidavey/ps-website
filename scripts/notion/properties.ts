/**
 * Typed, total accessors for Notion page properties.
 *
 * Notion returns a deeply nested discriminated union per property, and every
 * field is optional in practice — a cleared cell, a deleted relation, or a
 * renamed column all yield `undefined`. These readers narrow that union once,
 * here, so that no mapper anywhere else has to write defensive `?.` chains.
 *
 * Every reader returns a defined value (empty string, empty array, null) and
 * never throws. Absence is a legitimate CMS state, not an error; enforce
 * required fields explicitly in the collection's mapper instead.
 */
import type { PageObjectResponse } from '@notionhq/client'

type Properties = PageObjectResponse['properties']
type Property = Properties[string]

/** Looks a property up by its Notion column name. */
function get(props: Properties, name: string): Property | undefined {
  return props[name]
}

function plain(rich: Array<{ plain_text: string }>): string {
  return rich
    .map((t) => t.plain_text)
    .join('')
    .trim()
}

export function readTitle(props: Properties, name: string): string {
  const prop = get(props, name)
  return prop?.type === 'title' ? plain(prop.title) : ''
}

export function readText(props: Properties, name: string): string {
  const prop = get(props, name)
  return prop?.type === 'rich_text' ? plain(prop.rich_text) : ''
}

export function readNumber(props: Properties, name: string): number | null {
  const prop = get(props, name)
  return prop?.type === 'number' ? prop.number : null
}

export function readCheckbox(props: Properties, name: string): boolean {
  const prop = get(props, name)
  return prop?.type === 'checkbox' ? prop.checkbox : false
}

export function readSelect(props: Properties, name: string): string | null {
  const prop = get(props, name)
  if (prop?.type === 'select') return prop.select?.name ?? null
  if (prop?.type === 'status') return prop.status?.name ?? null
  return null
}

export function readMultiSelect(props: Properties, name: string): string[] {
  const prop = get(props, name)
  return prop?.type === 'multi_select' ? prop.multi_select.map((o) => o.name) : []
}

/** ISO-8601 start date, or null. Notion date ranges collapse to their start. */
export function readDate(props: Properties, name: string): string | null {
  const prop = get(props, name)
  return prop?.type === 'date' ? (prop.date?.start ?? null) : null
}

export function readUrl(props: Properties, name: string): string | null {
  const prop = get(props, name)
  if (prop?.type === 'url') return prop.url
  if (prop?.type === 'email') return prop.email ? `mailto:${prop.email}` : null
  return null
}

/** Related page IDs. Resolve them to records in the mapper if needed. */
export function readRelation(props: Properties, name: string): string[] {
  const prop = get(props, name)
  return prop?.type === 'relation' ? prop.relation.map((r) => r.id) : []
}

export type NotionFile = { url: string; name: string }

/**
 * File and image attachments.
 *
 * NOTE: URLs on Notion-hosted files are pre-signed and expire in about an
 * hour. They must never be written into the site output — `localizeAsset` in
 * scripts/notion/assets.ts downloads them at build time instead.
 */
export function readFiles(props: Properties, name: string): NotionFile[] {
  const prop = get(props, name)
  if (prop?.type !== 'files') return []
  return prop.files.flatMap((file) => {
    const url = file.type === 'external' ? file.external.url : (file.file?.url ?? '')
    return url ? [{ url, name: file.name }] : []
  })
}

/** The page cover image, if one is set. Subject to the same URL expiry. */
export function readCover(page: PageObjectResponse): string | null {
  const cover = page.cover
  if (!cover) return null
  return cover.type === 'external' ? cover.external.url : cover.file.url
}
