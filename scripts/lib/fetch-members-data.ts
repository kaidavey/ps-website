import { collectAllDataSourceRows, isFullPage } from '@notionhq/client'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { isKnownYear } from '../../src/lib/members.ts'
import { normalizeMember, type Member } from '../../src/lib/notion.ts'
import { connectToDataSource } from './notion-connection.ts'

const OUTPUT_PATH = fileURLToPath(new URL('../../src/content/members.generated.ts', import.meta.url))
const PHOTOS_DIR = fileURLToPath(new URL('../../public/members/', import.meta.url))

// Image optimization settings
const PHOTO_SIZE = 400 // Target size for profile photos (400x400)
const PHOTO_QUALITY = 85 // WebP quality (85 is high quality, small file size)

/**
 * Downloads a member's photo, optimizes it, and self-hosts it under public/members/, named by content hash.
 * Notion-uploaded files are served from temporary signed URLs that expire (~1hr) — since we bake
 * this URL into a static file, we can never store Notion's own link directly.
 *
 * Optimizations:
 * - Resizes to 400x400 (cover fit)
 * - Converts to WebP format
 * - Compresses to 85% quality
 * - Hashes the optimized bytes (cache busting when content changes)
 * - Smart caching: skips re-saving if hash matches existing file
 *
 * Returns '' on any failure so one bad photo doesn't block the rest of the roster.
 */
async function downloadPhoto(url: string, memberId: string): Promise<string> {
  try {
    // Check if we already have a photo for this member
    mkdirSync(PHOTOS_DIR, { recursive: true })
    const existingFiles = existsSync(PHOTOS_DIR) ? readdirSync(PHOTOS_DIR) : []
    const existingFile = existingFiles.find((f) => f.startsWith(`${memberId}-`))

    // Download and optimize the image
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const originalBytes = new Uint8Array(await response.arrayBuffer())

    // Optimize: resize to 400x400 and convert to WebP
    const optimizedBytes = await sharp(originalBytes)
      .resize(PHOTO_SIZE, PHOTO_SIZE, { fit: 'cover', position: 'center' })
      .webp({ quality: PHOTO_QUALITY })
      .toBuffer()

    // Hash the optimized image (not the original)
    const hash = createHash('sha256').update(optimizedBytes).digest('hex').slice(0, 8)
    const filename = `${memberId}-${hash}.webp`

    // Smart caching: only save if hash changed
    if (existingFile === filename) {
      console.log(`[notion] using cached photo for ${memberId} (${filename})`)
      return `/members/${filename}`
    }

    // Save the new optimized image
    writeFileSync(join(PHOTOS_DIR, filename), optimizedBytes)
    console.log(`[notion] optimized photo for ${memberId} (${filename}, ${(optimizedBytes.length / 1024).toFixed(1)}KB)`)

    // Clean up old version for this member
    if (existingFile && existingFile !== filename) {
      rmSync(join(PHOTOS_DIR, existingFile))
      console.log(`[notion] removed old photo ${existingFile}`)
    }

    return `/members/${filename}`
  } catch (error) {
    console.warn(`[notion] could not download photo for ${memberId}:`, error instanceof Error ? error.message : error)
    return ''
  }
}

/** Downloads every member's photo and removes any previously-downloaded files that are no longer used. */
async function resolvePhotos(members: Member[]): Promise<Member[]> {
  const resolved = await Promise.all(
    members.map(async (member) => ({
      ...member,
      photo: member.photo ? await downloadPhoto(member.photo, member.id) : '',
    })),
  )

  const keep = new Set(resolved.map((member) => member.photo.split('/').pop()).filter(Boolean))
  if (existsSync(PHOTOS_DIR)) {
    for (const file of readdirSync(PHOTOS_DIR)) {
      if (!keep.has(file)) rmSync(join(PHOTOS_DIR, file))
    }
  }

  return resolved
}

/**
 * Flags rows whose Notion `Year` value the site can't place on the page, so they surface here
 * instead of silently vanishing from the roster.
 */
function warnAboutUnplacedMembers(members: Member[]): void {
  const unplaced = members.filter((member) => !isKnownYear(member.year))
  if (unplaced.length === 0) return

  const values = [...new Set(unplaced.map((member) => member.year || '(empty)'))]
  console.warn(
    `[notion] ${unplaced.length} member(s) will not render — unrecognised Year value(s): ${values.join(', ')}`,
  )
}

/** Fetches the roster from Notion, downloads photos, and (re)writes the generated content file. Returns the row count, and whether the file's contents actually changed. */
export async function fetchAndWriteMembers(): Promise<{ count: number; changed: boolean }> {
  const { notion, dataSourceId } = await connectToDataSource()

  const rows = await collectAllDataSourceRows(notion, { data_source_id: dataSourceId })
  const members = await resolvePhotos(
    rows
      .filter(isFullPage)
      .map(normalizeMember)
      .sort((a, b) => a.name.localeCompare(b.name)),
  )

  warnAboutUnplacedMembers(members)

  const output = `// Auto-generated by scripts/fetch-members.ts — do not edit by hand.
import type { Member } from '../lib/notion.ts'

export const members: Member[] = ${JSON.stringify(members, null, 2)}
`

  const previous = existsSync(OUTPUT_PATH) ? readFileSync(OUTPUT_PATH, 'utf8') : null
  const changed = previous !== output
  if (changed) {
    writeFileSync(OUTPUT_PATH, output)
  }

  return { count: members.length, changed }
}
