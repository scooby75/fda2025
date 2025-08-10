
import { supabase } from '@/integrations/supabase/client'

export class User {
  static async me() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return {
      id: user?.id || '',
      email: user?.email || '',
      role: user?.user_metadata?.role || 'user'
    }
  }

  static async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  }

  static async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  static async list() {
    // This would require admin access to list users
    // For now, return empty array
    return []
  }
}
