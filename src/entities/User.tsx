
import { supabase } from '@/integrations/supabase/client'

export class User {
  static async me(): Promise<any> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    
    const { data, error } = await supabase
      .from('user')
      .select('*')
      .eq('email', user.email)
      .single()
    
    if (error) throw error
    return data
  }

  static async list(orderBy?: string): Promise<any[]> {
    let query = supabase
      .from('user')
      .select('*')
    
    if (orderBy) {
      const isDescending = orderBy.startsWith('-')
      const field = isDescending ? orderBy.slice(1) : orderBy
      query = query.order(field, { ascending: !isDescending })
    } else {
      query = query.order('created_date', { ascending: false })
    }
    
    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  static async update(id: string, data: any): Promise<any> {
    const { data: result, error } = await supabase
      .from('user')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('user')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
