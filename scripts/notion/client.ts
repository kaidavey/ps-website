/**
 * Notion client and data-source resolution.
 *
 * Runs at BUILD TIME ONLY. The integration token is a server secret; it is
 * never imported from src/ and therefore never reaches the browser bundle.
 */
import { Client, isFullDatabase, isFullPage, iteratePaginatedAPI } from '@notionhq/client'
import type { PageObjectResponse, QueryDataSourceParameters } from '@notionhq/client'

export function createClient(): Client {
  const auth = process.env.NOTION_TOKEN
  if (!auth) {
    throw new Error(
      'NOTION_TOKEN is not set. Copy .env.example to .env and add your integration token.',
    )
  }
  return new Client({ auth })
}

/**
 * Resolves a database ID to the data source that holds its rows.
 *
 * As of Notion API version 2025-09-03 a database is a container for one or
 * more data sources, and rows are queried from a data source rather than the
 * database. Nearly every database has exactly one; if yours has several, put
 * the data source ID in the collection config directly.
 */
export async function resolveDataSourceId(
  notion: Client,
  databaseId: string,
): Promise<string> {
  const database = await notion.databases.retrieve({ database_id: databaseId })

  // A partial response means the integration lacks read access to the database.
  if (!isFullDatabase(database)) {
    throw new Error(
      `No read access to database ${databaseId}. Share it with the integration ` +
        'via the ••• menu -> Connections.',
    )
  }

  const sources = database.data_sources
  const first = sources[0]

  if (!first) {
    throw new Error(`Database ${databaseId} has no data sources.`)
  }
  if (sources.length > 1) {
    const names = sources.map((s) => `${s.name} (${s.id})`).join(', ')
    throw new Error(
      `Database ${databaseId} has ${sources.length} data sources: ${names}. ` +
        'Set `dataSourceId` on the collection to choose one.',
    )
  }
  return first.id
}

/**
 * Fetches every row of a data source, following pagination.
 *
 * Partial pages (returned when the integration lacks read access to some
 * property) are dropped rather than silently mapped to empty records.
 */
export async function queryAllRows(
  notion: Client,
  dataSourceId: string,
  query: Omit<QueryDataSourceParameters, 'data_source_id'> = {},
): Promise<PageObjectResponse[]> {
  const rows: PageObjectResponse[] = []
  for await (const page of iteratePaginatedAPI(notion.dataSources.query, {
    data_source_id: dataSourceId,
    ...query,
  })) {
    if (isFullPage(page)) rows.push(page)
  }
  return rows
}
