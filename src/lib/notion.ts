import type { PageObjectResponse } from '@notionhq/client'

export interface Member {
  id: string
  name: string
  role: string
  bio: string
  photo: string
  linkedin: string | null
  year: string
}

function plainText(rich: Array<{ plain_text: string }>): string {
  return rich.map((item) => item.plain_text).join('')
}

/** Extracts a clean Member from a raw Notion page. No Notion property shapes escape this function. */
export function normalizeMember(page: PageObjectResponse): Member {
  const props = page.properties
  return {
    id: page.id,
    name: props.Name?.type === 'title' ? plainText(props.Name.title) : '',
    role: props.Role?.type === 'select' ? (props.Role.select?.name ?? '') : '',
    bio: props.Bio?.type === 'rich_text' ? plainText(props.Bio.rich_text) : '',
    photo: props.Photo?.type === 'url' ? (props.Photo.url ?? '') : '',
    linkedin: props.LinkedIn?.type === 'url' ? props.LinkedIn.url : null,
    year: props.Year?.type === 'select' ? (props.Year.select?.name ?? '') : '',
  }
}
