
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/types/supabase'

type StrategyRow = Database['public']['Tables']['strategy']['Row']
type StrategyInsert = Database['public']['Tables']['strategy']['Insert']

export class Strategy {
  static async list(): Promise<StrategyRow[]> {
    const { data, error } = await supabase
      .from('strategy')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async filter(filters: Record<string, any>, orderBy?: string): Promise<StrategyRow[]> {
    let query = supabase.from('strategy').select('*')
    
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

  static async create(data: StrategyInsert & { results?: any }): Promise<StrategyRow> {
    const { data: result, error } = await supabase
      .from('strategy')
      .insert({
        name: data.name,
        description: data.description,
        market: data.market,
        unit_stake: data.unit_stake,
        min_odds: data.min_odds,
        max_odds: data.max_odds,
        start_date: data.start_date,
        end_date: data.end_date,
        leagues: data.leagues,
        home_teams: data.home_teams,
        away_teams: data.away_teams,
        results: data.results
      })
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('strategy')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
