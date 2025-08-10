
import { supabase } from '@/integrations/supabase/client'

export interface UserData {
  id: string;
  email: string;
  role: string;
  full_name?: string;
  status: string;
  created_date: string;
}

export class User {
  static async me(): Promise<{ email: string; id: string }> {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) throw error
    if (!user) throw new Error('User not authenticated')
    
    return {
      email: user.email || '',
      id: user.id
    }
  }

  static async list(): Promise<UserData[]> {
    // Mock implementation - in reality you'd query a profiles table
    return []
  }

  static async get(id: string): Promise<UserData> {
    // Mock implementation
    return {
      id,
      email: 'user@example.com',
      role: 'user',
      full_name: 'User Name',
      status: 'active',
      created_date: new Date().toISOString()
    }
  }

  static async update(id: string, data: Partial<UserData>): Promise<UserData> {
    // Mock implementation
    return {
      id,
      email: data.email || 'user@example.com',
      role: data.role || 'user',
      full_name: data.full_name,
      status: data.status || 'active',
      created_date: new Date().toISOString()
    }
  }

  static async delete(id: string): Promise<void> {
    // Mock implementation
    console.log('Deleting user:', id)
  }
}
