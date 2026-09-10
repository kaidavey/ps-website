import { collectAllDataSourceRows, isFullPage } from '@notionhq/client'
import { connectToDataSource } from './lib/notion-connection.ts'

/**
 * The properties normalizeMember() reads, and the Notion property type(s) each must be for that
 * mapping to work. A previous mismatch here (Role assumed "select" when it's really "rich_text",
 * "Bio" assumed to exist when the real field is "Internship") silently produced empty strings
 * instead of failing — this check catches that class of bug instead of shipping blank cards.
 * Photo accepts either shape: "files" (an uploaded/attached image) or the legacy "url" property.
 */
const EXPECTED_PROPERTIES: Record<string, string[]> = {
  Name: ['title'],
  Role: ['rich_text'],
  Internship: ['rich_text'],
  Major: ['rich_text'],
  Order: ['number'],
  Year: ['select'],
  Photo: ['files', 'url'],
}

async function main() {
  const { notion, dataSourceId } = await connectToDataSource()
  console.log('Connected to Notion and resolved the data source.')

  const rows = (await collectAllDataSourceRows(notion, { data_source_id: dataSourceId })).filter(isFullPage)
  console.log(`Found ${rows.length} row(s) in the database.`)

  const sample = rows[0]
  if (!sample) {
    console.warn('No rows to check property types against — add a row to fully verify the schema.')
    return
  }

  let mismatches = 0
  for (const [property, expectedTypes] of Object.entries(EXPECTED_PROPERTIES)) {
    const actualType = sample.properties[property]?.type
    if (actualType && expectedTypes.includes(actualType)) {
      console.log(`  ok   ${property} (${actualType})`)
    } else {
      mismatches++
      console.error(`  FAIL ${property}: expected type "${expectedTypes.join('" or "')}", found "${actualType ?? 'missing'}"`)
    }
  }

  if (mismatches > 0) {
    console.error(
      `\n${mismatches} propert${mismatches === 1 ? 'y' : 'ies'} mismatched — normalizeMember() in src/lib/notion.ts ` +
        'will silently return empty values for these until the property name/type or the mapping is fixed.',
    )
    process.exit(1)
  }

  console.log('\nNotion connection and schema look correct.')
}

main().catch((error: unknown) => {
  console.error('Notion connection check failed:', error)
  process.exit(1)
})
