export interface User {
  id: string
  email: string
  full_name?: string | null
  name?: string | null
  roles?: string[]
  is_active: boolean
  created_at?: string | null
}