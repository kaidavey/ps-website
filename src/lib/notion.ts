import type { PageObjectResponse } from '@notionhq/client'

export interface Member {
  id: string
  name: string
  role: string
  internship: string
  photo: string
}

function plainText(rich: Array<{ plain_text: string }>): string {
  return rich.map((item) => item.plain_text).join('')
}

/** Reads a photo URL from either a "files" (uploaded/attached) or a legacy "url" property. */
function extractPhotoUrl(prop: PageObjectResponse['properties'][string] | undefined): string {
  if (prop?.type === 'files') {
    const file = prop.files[0]
    if (!file) return ''
    return file.type === 'file' ? file.file.url : file.external.url
  }
  if (prop?.type === 'url') {
    return prop.url ?? ''
  }
  return ''
}

/** Extracts a clean Member from a raw Notion page. No Notion property shapes escape this function. */
export function normalizeMember(page: PageObjectResponse): Member {
  const props = page.properties
  return {
    id: page.id,
    name: props.Name?.type === 'title' ? plainText(props.Name.title) : '',
    role: props.Role?.type === 'rich_text' ? plainText(props.Role.rich_text) : '',
    internship: props.Internship?.type === 'rich_text' ? plainText(props.Internship.rich_text) : '',
    photo: extractPhotoUrl(props.Photo),
  }
}
