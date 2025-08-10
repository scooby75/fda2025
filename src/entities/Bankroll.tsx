
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'

type BankrollRow = Database['public']['Tables']['bankroll']['Row']
type BankrollInsert = Database['public']['Tables']['bankroll']['Insert']

export class Bankroll {
  static async list(): Promise<BankrollRow[]> {
    const { data, error } = await supabase
      .from('bankroll')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async get(id: number): Promise<BankrollRow> {
    const { data, error } = await supabase
      .from('bankroll')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async filter(filters: Record<string, any>, orderBy?: string): Promise<BankrollRow[]> {
    let query = supabase.from('bankroll').select('*')
    
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'created_by' && value) {
        query = query.eq('owner_id', value)
      }
    })
    
    if (orderBy) {
      const isDescending = orderBy.startsWith('-')
      const field = isDescending ? orderBy.slice(1) : orderBy
      query = query.order(field, { ascending: !isDescending })
    }
    
    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  static async create(data: BankrollInsert): Promise<BankrollRow> {
    const { data: result, error } = await supabase
      .from('bankroll')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: number, data: Partial<BankrollInsert>): Promise<BankrollRow> {
    const { data: result, error } = await supabase
      .from('bankroll')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('bankroll')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
