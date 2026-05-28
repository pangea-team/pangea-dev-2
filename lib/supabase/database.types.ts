/**
 * Placeholder Supabase database types.
 *
 * Regenerate with:
 *   pnpm db:types
 *
 * which runs:
 *   supabase gen types typescript --local > lib/supabase/database.types.ts
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: Record<string, never>
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
