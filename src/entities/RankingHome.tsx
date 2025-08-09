
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'

type RankingHomeRow = Database['public']['Tables']['rankinghome']['Row']
type RankingHomeInsert = Database['public']['Tables']['rankinghome']['Insert']

export class RankingHome {
  static async list(): Promise<RankingHomeRow[]> {
    const { data, error } = await supabase
      .from('rankinghome')
      .select('*')
      .order('ranking_home')
    
    if (error) throw error
    return data || []
  }

  static async create(data: RankingHomeInsert): Promise<RankingHomeRow> {
    const { data: result, error } = await supabase
      .from('rankinghome')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async bulkCreate(dataArray: RankingHomeInsert[]): Promise<RankingHomeRow[]> {
    const { data, error } = await supabase
      .from('rankinghome')
      .insert(dataArray)
      .select()
    
    if (error) throw error
    return data || []
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('rankinghome')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  static schema() {
    return {
      properties: {
        league: { type: 'string' },
        season: { type: 'string' },
        home: { type: 'string' },
        draw: { type: 'number' },
        loss: { type: 'number' },
        win: { type: 'number' },
        points_home: { type: 'number' },
        goal_difference_home: { type: 'number' },
        ranking_home: { type: 'number' }
      }
    }
  }
}
