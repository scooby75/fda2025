
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/types/supabase'

type RankingHomeRow = Database['public']['Tables']['rankinghome']['Row']
type RankingHomeInsert = Database['public']['Tables']['rankinghome']['Insert']

export class RankingHome {
  static async list(): Promise<RankingHomeRow[]> {
    const { data, error } = await supabase
      .from('rankinghome')
      .select('*')
      .order('season', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async filter(filters: Record<string, any>): Promise<RankingHomeRow[]> {
    let query = supabase.from('rankinghome').select('*')
    
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
