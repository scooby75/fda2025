
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'

type BetTransactionRow = Database['public']['Tables']['bet_transaction']['Row']
type BetTransactionInsert = Database['public']['Tables']['bet_transaction']['Insert']

export class BetTransaction {
  static async list(orderBy?: string): Promise<BetTransactionRow[]> {
    let query = supabase
      .from('bet_transaction')
      .select('*')
    
    if (orderBy) {
      const isDescending = orderBy.startsWith('-')
      const field = isDescending ? orderBy.slice(1) : orderBy
      query = query.order(field, { ascending: !isDescending })
    } else {
      query = query.order('created_at', { ascending: false })
    }
    
    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  static async filter(filters: Record<string, any>): Promise<BetTransactionRow[]> {
    let query = supabase.from('bet_transaction').select('*')
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        query = query.eq(key, value)
      }
    })
    
    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  static async create(data: BetTransactionInsert): Promise<BetTransactionRow> {
    const { data: result, error } = await supabase
      .from('bet_transaction')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: number, data: Partial<BetTransactionInsert>): Promise<BetTransactionRow> {
    const { data: result, error } = await supabase
      .from('bet_transaction')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('bet_transaction')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
