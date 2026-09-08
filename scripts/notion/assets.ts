/**
 * Downloads Notion-hosted images into the site's own assets.
 *
 * This is not an optimisation, it is a correctness requirement: URLs returned
 * for Notion-hosted files are pre-signed and expire roughly an hour after they
 * are issued. A build that embedded them would render broken images the same
 * afternoon. Externally-hosted URLs are stable and are passed through as-is.
 *
 * Files are named by a hash of their source URL path, so an unchanged image
 * keeps the same filename across builds and stays cacheable.
 */
import { createHash } from 'node:crypto'
import { mkdir, writeFile, readdir, rm } from 'node:fs/promises'
import { extname } from 'node:path'

/** Written to public/, so the served path is /content/<file>. */
const OUTPUT_DIR = new URL('../../public/content/', import.meta.url)
const PUBLIC_PATH = '/content'

const seen = new Set<string>()

function isNotionHosted(url: string): boolean {
  const { hostname } = new URL(url)
  return hostname.endsWith('.amazonaws.com') || hostname.endsWith('notion-static.com')
}

/**
 * Returns a stable, site-relative path for `url`, downloading it if needed.
 * Returns the original URL unchanged for externally-hosted files, and null
 * when given nothing.
 */
export async function localizeAsset(url: string | null): Promise<string | null> {
  if (!url) return null
  if (!isNotionHosted(url)) return url

  const { pathname } = new URL(url)
  const hash = createHash('sha256').update(pathname).digest('hex').slice(0, 16)
  const filename = `${hash}${extname(pathname) || '.bin'}`

  if (!seen.has(filename)) {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to download asset (${response.status}): ${pathname}`)
    }
    await mkdir(OUTPUT_DIR, { recursive: true })
    await writeFile(
      new URL(filename, OUTPUT_DIR),
      Buffer.from(await response.arrayBuffer()),
    )
    seen.add(filename)
  }

  return `${PUBLIC_PATH}/${filename}`
}

/** Deletes downloaded assets no longer referenced by any collection. */
export async function pruneUnusedAssets(): Promise<number> {
  let existing: string[]
  try {
    existing = await readdir(OUTPUT_DIR)
  } catch {
    return 0
  }

  const stale = existing.filter((file) => !seen.has(file))
  await Promise.all(stale.map((file) => rm(new URL(file, OUTPUT_DIR))))
  return stale.length
}
