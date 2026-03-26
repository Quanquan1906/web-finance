export interface User {
  id: string
  email: string
  name?: string | null
  roles: string[]
  is_active: boolean
  created_at?: string | null
}