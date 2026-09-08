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
 */
import type { PageObjectResponse, QueryDataSourceParameters } from '@notionhq/client'
import type { TeamMember } from '../../src/content/schema.ts'
import { slugify } from '../../src/content/slug.ts'
import { localizeAsset } from './assets.ts'
import {
  readFiles,
  readNumber,
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
 * EXAMPLE COLLECTION — delete or rewrite once the real databases exist.
 * Every construct the site is likely to need is demonstrated here.
 */
const team: Collection<TeamMember> = {
  key: 'team',
  databaseIdEnv: 'NOTION_TEAM_DATABASE_ID',
  query: {
    // Only published rows reach the site: an editor's drafts stay private.
    filter: { property: 'Published', checkbox: { equals: true } },
    sorts: [{ property: 'Order', direction: 'ascending' }],
  },
  async map(page) {
    const props = page.properties
    const name = readTitle(props, 'Name')

    if (!name) {
      throw new Error(
        `Team member ${page.id} has no Name. Fill it in or unpublish the row.`,
      )
    }

    return {
      id: page.id,
      slug: slugify(name),
      name,
      role: readSelect(props, 'Role') ?? '',
      bio: readText(props, 'Bio'),
      photo: await localizeAsset(readFiles(props, 'Photo')[0]?.url ?? null),
      linkedIn: readUrl(props, 'LinkedIn'),
      order: readNumber(props, 'Order'),
    }
  },
}

/**
 * Typed as a readonly tuple of unknown-payload collections so the runner can
 * iterate them uniformly while each mapper keeps its precise return type.
 */
export const collections: ReadonlyArray<Collection<unknown>> = [team]
