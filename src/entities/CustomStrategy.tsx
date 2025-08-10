
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/types/supabase'

type CustomStrategyRow = Database['public']['Tables']['custom_strategy']['Row']
type CustomStrategyInsert = Database['public']['Tables']['custom_strategy']['Insert']

export class CustomStrategy {
  static async list(): Promise<CustomStrategyRow[]> {
    const { data, error } = await supabase
      .from('custom_strategy')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async create(data: CustomStrategyInsert): Promise<CustomStrategyRow> {
    const { data: result, error } = await supabase
      .from('custom_strategy')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: number, data: Partial<CustomStrategyInsert>): Promise<CustomStrategyRow> {
    const { data: result, error } = await supabase
      .from('custom_strategy')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('custom_strategy')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
