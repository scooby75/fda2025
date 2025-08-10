
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'

type CustomCompetitionRow = Database['public']['Tables']['custom_competition']['Row']
type CustomCompetitionInsert = Database['public']['Tables']['custom_competition']['Insert']

export class CustomCompetition {
  static async list(): Promise<CustomCompetitionRow[]> {
    const { data, error } = await supabase
      .from('custom_competition')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async create(data: CustomCompetitionInsert): Promise<CustomCompetitionRow> {
    const { data: result, error } = await supabase
      .from('custom_competition')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('custom_competition')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
