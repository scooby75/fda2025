
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/types/supabase'

type DailyGameRow = Database['public']['Tables']['dailygame']['Row']
type DailyGameInsert = Database['public']['Tables']['dailygame']['Insert']

export class DailyGame {
  static async list(): Promise<DailyGameRow[]> {
    const { data, error } = await supabase
      .from('dailygame')
      .select('*')
      .order('date', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async create(data: DailyGameInsert): Promise<DailyGameRow> {
    const { data: result, error } = await supabase
      .from('dailygame')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: number, data: Partial<DailyGameInsert>): Promise<DailyGameRow> {
    const { data: result, error } = await supabase
      .from('dailygame')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('dailygame')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
