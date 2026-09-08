#!/usr/bin/env node
/**
 * Build-time Notion fetch.
 *
 *   npm run content:fetch
 *
 * Pulls every collection in scripts/notion/collections.ts, maps each row to
 * the site's own content model, downloads referenced images, and writes the
 * result to src/content/generated/*.json — which is committed, so that:
 *
 *   - `npm run build` never depends on Notion being reachable,
 *   - `npm run dev` works offline and without a token,
 *   - a bad content change is visible as a reviewable diff before deploy.
 *
 * Publishing flow: edit in Notion -> run this script (locally or in CI on a
 * schedule / webhook) -> commit the JSON diff -> deploy.
 *
 * The script is intentionally all-or-nothing per collection: a mapper that
 * throws fails the run rather than writing a half-populated file.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { pruneUnusedAssets } from './notion/assets.ts'
import { createClient, queryAllRows, resolveDataSourceId } from './notion/client.ts'
import { collections } from './notion/collections.ts'

const OUTPUT_DIR = new URL('../src/content/generated/', import.meta.url)

try {
  process.loadEnvFile('.env')
} catch {
  // No .env file — fall back to the ambient environment (how CI supplies it).
}

async function run(): Promise<void> {
  const notion = createClient()
  await mkdir(OUTPUT_DIR, { recursive: true })

  let fetched = 0

  for (const collection of collections) {
    const databaseId = process.env[collection.databaseIdEnv]

    if (!databaseId) {
      console.warn(
        `skip  ${collection.key} — ${collection.databaseIdEnv} is not set; ` +
          'keeping the committed JSON.',
      )
      continue
    }

    const dataSourceId =
      collection.dataSourceId ?? (await resolveDataSourceId(notion, databaseId))
    const rows = await queryAllRows(notion, dataSourceId, collection.query)
    const records = []
    for (const row of rows) {
      records.push(await collection.map(row))
    }

    await writeFile(
      new URL(`${collection.key}.json`, OUTPUT_DIR),
      `${JSON.stringify(records, null, 2)}\n`,
    )
    console.log(`write ${collection.key} — ${records.length} record(s)`)
    fetched += 1
  }

  if (fetched > 0) {
    const pruned = await pruneUnusedAssets()
    if (pruned > 0) console.log(`prune ${pruned} unreferenced asset(s)`)
  }
}

try {
  await run()
} catch (error) {
  console.error(
    `\nContent fetch failed: ${error instanceof Error ? error.message : error}`,
  )
  process.exitCode = 1
}
