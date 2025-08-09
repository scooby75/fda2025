
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'

type DailyGameRow = Database['public']['Tables']['dailygame']['Row']
type DailyGameInsert = Database['public']['Tables']['dailygame']['Insert']

export class DailyGame {
  static async list(): Promise<DailyGameRow[]> {
    const { data, error } = await supabase
      .from('dailygame')
      .select('*')
      .order('date')
    
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

  static async bulkCreate(dataArray: DailyGameInsert[]): Promise<DailyGameRow[]> {
    const { data, error } = await supabase
      .from('dailygame')
      .insert(dataArray)
      .select()
    
    if (error) throw error
    return data || []
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('dailygame')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  static schema() {
    return {
      properties: {
        league: { type: 'string' },
        date: { type: 'string' },
        time: { type: 'string' },
        rodada: { type: 'string' },
        home: { type: 'string' },
        away: { type: 'string' },
        odd_h_ht: { type: 'number' },
        odd_d_ht: { type: 'number' },
        odd_a_ht: { type: 'number' },
        odd_h_ft: { type: 'number' },
        odd_d_ft: { type: 'number' },
        odd_a_ft: { type: 'number' },
        ppg_home: { type: 'number' },
        ppg_away: { type: 'number' },
        xg_home_pre: { type: 'number' },
        xg_away_pre: { type: 'number' },
        odd_btts_yes: { type: 'number' },
        odd_btts_no: { type: 'number' }
      }
    }
  }
}
