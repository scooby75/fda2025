
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/types/supabase'

type GameDataRow = Database['public']['Tables']['gamedata']['Row']

export class GameData {
  static async list(): Promise<GameDataRow[]> {
    const { data, error } = await supabase
      .from('gamedata')
      .select('*')
      .order('date', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async filter(filters: Record<string, any>): Promise<GameDataRow[]> {
    let query = supabase.from('gamedata').select('*')
    
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
