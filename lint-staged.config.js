// biome check --write passes files explicitly, bypassing biome.json's files.ignore.
// Filter auto-generated and library files here so they aren't reformatted.
const SHADCN = [
  'components/ui/',
  'hooks/use-toast.ts',
  'components/theme-provider.tsx',
  'lib/supabase/database.types.ts',
]

/** @type {import('lint-staged').Config} */
module.exports = {
  '*.{js,jsx,ts,tsx,json}': (files) => {
    const filtered = files.filter((f) => !SHADCN.some((p) => f.includes(p)))
    if (filtered.length === 0) return []
    return [`biome check --write ${filtered.join(' ')}`]
  },
}
