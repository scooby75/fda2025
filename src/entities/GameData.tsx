
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'

type GameDataRow = Database['public']['Tables']['gamedata']['Row']
type GameDataInsert = Database['public']['Tables']['gamedata']['Insert']

export class GameData {
  static async list(): Promise<GameDataRow[]> {
    const { data, error } = await supabase
      .from('gamedata')
      .select('*')
      .order('date', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async create(data: GameDataInsert): Promise<GameDataRow> {
    const { data: result, error } = await supabase
      .from('gamedata')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async bulkCreate(dataArray: GameDataInsert[]): Promise<GameDataRow[]> {
    const { data, error } = await supabase
      .from('gamedata')
      .insert(dataArray)
      .select()
    
    if (error) throw error
    return data || []
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('gamedata')
      .delete()
      .eq('id_jogo', id)
    
    if (error) throw error
  }

  static schema() {
    return {
      properties: {
        id_jogo: { type: 'number' },
        league: { type: 'string' },
        season: { type: 'number' },
        date: { type: 'string' },
        rodada: { type: 'number' },
        home: { type: 'string' },
        away: { type: 'string' },
        goals_h_ht: { type: 'number' },
        goals_a_ht: { type: 'number' },
        goals_h_ft: { type: 'number' },
        goals_a_ft: { type: 'number' },
        odd_h_ft: { type: 'number' },
        odd_d_ft: { type: 'number' },
        odd_a_ft: { type: 'number' },
        ppg_home_pre: { type: 'number' },
        ppg_away_pre: { type: 'number' },
        xg_home_pre: { type: 'number' },
        xg_away_pre: { type: 'number' },
        shotsontarget_h: { type: 'number' },
        shotsontarget_a: { type: 'number' },
        shotsofftarget_h: { type: 'number' },
        shotsofftarget_a: { type: 'number' },
        odd_over15_ft: { type: 'number' },
        odd_over25_ft: { type: 'number' },
        odd_under15_ft: { type: 'number' },
        odd_under25_ft: { type: 'number' },
        odd_btts_yes: { type: 'number' },
        odd_btts_no: { type: 'number' },
        odd_dc_1x: { type: 'number' },
        odd_dc_12: { type: 'number' },
        odd_dc_x2: { type: 'number' }
      }
    }
  }
}
