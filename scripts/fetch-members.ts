import { fetchAndWriteMembers } from './lib/fetch-members-data.ts'

fetchAndWriteMembers()
  .then(({ count }) => console.log(`Wrote ${count} member(s) to src/content/members.generated.ts`))
  .catch((error: unknown) => {
    console.error('Failed to fetch members from Notion:', error)
    process.exit(1)
  })
