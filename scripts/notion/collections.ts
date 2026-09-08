/**
 * The registry of Notion databases the site pulls from.
 *
 * Adding a collection is three edits and nothing else:
 *   1. Add its model to src/content/schema.ts
 *   2. Add an entry here, mapping Notion columns to that model
 *   3. Add an accessor to src/content/index.ts
 *
 * The string literals in each mapper are Notion column names. They are a
 * contract with the Notion workspace: if someone renames a column, the
 * corresponding field goes empty. Guard the fields you cannot render without
 * by throwing in the mapper — a failed build is far cheaper than a silently
 * blank page in production.
 *
 * None of these databases exists yet. The committed JSON in
 * src/content/generated/ carries the copy from the Figma design, so the site
 * builds and renders today; once the databases are created and their IDs are
 * in .env, `npm run content:fetch` overwrites it. Verify the column names
 * below against the real databases at that point.
 */
import type { PageObjectResponse, QueryDataSourceParameters } from '@notionhq/client'
import type { EventItem, GalleryPhoto, Image, Pillar } from '../../src/content/schema.ts'
import { slugify } from '../../src/content/slug.ts'
import { localizeAsset } from './assets.ts'
import {
  readDate,
  readFiles,
  readSelect,
  readText,
  readTitle,
  readUrl,
} from './properties.ts'

export type Collection<T> = {
  /** Output filename: src/content/generated/<key>.json */
  key: string
  /** Name of the environment variable holding the Notion database ID. */
  databaseIdEnv: string
  /** Set only when the database has more than one data source. */
  dataSourceId?: string
  /** Optional server-side filter and sort. */
  query?: Omit<QueryDataSourceParameters, 'data_source_id'>
  map: (page: PageObjectResponse) => Promise<T> | T
}

/**
 * Only published rows reach the site, so an editor's drafts stay private.
 * Every database needs a `Published` checkbox for this to work.
 */
const publishedOnly = {
  filter: { property: 'Published', checkbox: { equals: true } },
} as const

/**
 * Notion does not expose intrinsic image dimensions, so they cannot be mapped
 * from a row. Reserving layout space needs them, so each collection declares
 * the aspect its design slot uses and the height is derived. If a future
 * database stores real dimensions, read them here instead.
 */
async function readImage(
  page: PageObjectResponse,
  property: string,
  alt: string,
  width: number,
  aspect: number,
): Promise<Image | null> {
  const src = await localizeAsset(readFiles(page.properties, property)[0]?.url ?? null)
  if (!src) return null
  return { src, alt, width, height: Math.round(width / aspect) }
}

const gallery: Collection<GalleryPhoto> = {
  key: 'gallery',
  databaseIdEnv: 'NOTION_GALLERY_DATABASE_ID',
  query: { ...publishedOnly, sorts: [{ property: 'Order', direction: 'ascending' }] },
  async map(page) {
    const caption = readTitle(page.properties, 'Caption')
    const image = await readImage(page, 'Photo', caption, 508, 508 / 337)

    if (!image) {
      throw new Error(
        `Gallery row ${page.id} has no Photo. Add one or unpublish the row.`,
      )
    }

    return { id: page.id, slug: slugify(caption) || page.id, image }
  },
}

const pillars: Collection<Pillar> = {
  key: 'pillars',
  databaseIdEnv: 'NOTION_PILLARS_DATABASE_ID',
  query: { ...publishedOnly, sorts: [{ property: 'Order', direction: 'ascending' }] },
  async map(page) {
    const title = readTitle(page.properties, 'Title')
    const description = readText(page.properties, 'Description')
    const image = await readImage(page, 'Image', title, 446, 446 / 300)

    if (!title || !description || !image) {
      throw new Error(
        `Pillar ${page.id} needs a Title, Description and Image. Fill them in or unpublish the row.`,
      )
    }

    return { id: page.id, slug: slugify(title), title, description, image }
  },
}

const events: Collection<EventItem> = {
  key: 'events',
  databaseIdEnv: 'NOTION_EVENTS_DATABASE_ID',
  query: { ...publishedOnly, sorts: [{ property: 'Date', direction: 'ascending' }] },
  map(page) {
    const title = readTitle(page.properties, 'Title')
    const date = readDate(page.properties, 'Date')

    if (!title || !date) {
      throw new Error(
        `Event ${page.id} needs a Title and Date. Fill them in or unpublish the row.`,
      )
    }

    return {
      id: page.id,
      slug: slugify(title),
      title,
      // Notion returns either "2026-09-14" or a full timestamp; the calendar
      // compares date strings, so trim any time component off.
      date: date.slice(0, 10),
      time: readText(page.properties, 'Time') || null,
      location:
        readSelect(page.properties, 'Location') ??
        readText(page.properties, 'Location') ??
        null,
      url: readUrl(page.properties, 'Link'),
    }
  },
}

/**
 * Typed as a readonly array of unknown-payload collections so the runner can
 * iterate them uniformly while each mapper keeps its precise return type.
 */
export const collections: ReadonlyArray<Collection<unknown>> = [gallery, pillars, events]
