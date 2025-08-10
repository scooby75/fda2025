
import { supabase } from '@/integrations/supabase/client'

export interface UserData {
  id: string;
  email: string;
  full_name: string;
  role: string;
  status: 'pending' | 'approved' | 'denied' | 'blocked';
  plan_type?: string;
  plan_expires_at?: string;
  approved_by?: string;
  approved_at?: string;
  last_login?: string;
  created_date: string;
}

export class User {
  static async me(): Promise<{ id: string; email: string; role: string; full_name?: string }> {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return {
      id: user?.id || '',
      email: user?.email || '',
      role: user?.user_metadata?.role || 'user',
      full_name: user?.user_metadata?.full_name || user?.email || ''
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

  static async list(orderBy?: string): Promise<UserData[]> {
    // Mock implementation since we can't access auth.users directly
    return []
  }

  static async update(id: string, data: Partial<UserData>): Promise<void> {
    // Mock implementation for user updates
    console.log('User update:', id, data)
  }

  static async delete(id: string): Promise<void> {
    // Mock implementation for user deletion
    console.log('User delete:', id)
  }
}
