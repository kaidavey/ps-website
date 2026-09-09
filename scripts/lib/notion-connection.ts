import { Client, isFullDatabase } from '@notionhq/client'

export function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    console.error(`Missing required environment variable: ${name}`)
    process.exit(1)
  }
  return value
}

/** Connects to Notion and resolves the database's data source, failing loudly on any mismatch. */
export async function connectToDataSource() {
  const notion = new Client({ auth: requireEnv('NOTION_TOKEN'), notionVersion: '2025-09-03' })

  const database = await notion.databases.retrieve({ database_id: requireEnv('NOTION_DB_ID') })
  if (!isFullDatabase(database)) {
    throw new Error('Notion returned a partial database response — check the integration has full access.')
  }

  const dataSourceId = database.data_sources[0]?.id
  if (!dataSourceId) {
    throw new Error('The Notion database has no data sources.')
  }

  return { notion, dataSourceId }
}
