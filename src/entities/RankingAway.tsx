
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'

type RankingAwayRow = Database['public']['Tables']['rankingaway']['Row']
type RankingAwayInsert = Database['public']['Tables']['rankingaway']['Insert']

export class RankingAway {
  static async list(): Promise<RankingAwayRow[]> {
    const { data, error } = await supabase
      .from('rankingaway')
      .select('*')
      .order('ranking_away')
    
    if (error) throw error
    return data || []
  }

  static async create(data: RankingAwayInsert): Promise<RankingAwayRow> {
    const { data: result, error } = await supabase
      .from('rankingaway')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async bulkCreate(dataArray: RankingAwayInsert[]): Promise<RankingAwayRow[]> {
    const { data, error } = await supabase
      .from('rankingaway')
      .insert(dataArray)
      .select()
    
    if (error) throw error
    return data || []
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('rankingaway')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  static schema() {
    return {
      properties: {
        league: { type: 'string' },
        season: { type: 'string' },
        away: { type: 'string' },
        draw: { type: 'number' },
        loss: { type: 'number' },
        win: { type: 'number' },
        points_away: { type: 'number' },
        goal_difference_away: { type: 'number' },
        ranking_away: { type: 'number' }
      }
    }
  }
}
