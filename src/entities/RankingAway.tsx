
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/types/supabase'

type RankingAwayRow = Database['public']['Tables']['rankingaway']['Row']
type RankingAwayInsert = Database['public']['Tables']['rankingaway']['Insert']

export class RankingAway {
  static async list(): Promise<RankingAwayRow[]> {
    const { data, error } = await supabase
      .from('rankingaway')
      .select('*')
      .order('season', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async filter(filters: Record<string, any>): Promise<RankingAwayRow[]> {
    let query = supabase.from('rankingaway').select('*')
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        query = query.eq(key, value)
      }
    })
    
    const { data, error } = await query
    if (error) throw error
    return data || []
  }
}
