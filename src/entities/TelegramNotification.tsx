
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'

type TelegramNotificationRow = Database['public']['Tables']['telegram_notification']['Row']
type TelegramNotificationInsert = Database['public']['Tables']['telegram_notification']['Insert']

export class TelegramNotification {
  static async list(): Promise<TelegramNotificationRow[]> {
    const { data, error } = await supabase
      .from('telegram_notification')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async create(data: TelegramNotificationInsert): Promise<TelegramNotificationRow> {
    const { data: result, error } = await supabase
      .from('telegram_notification')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: number, data: Partial<TelegramNotificationInsert>): Promise<TelegramNotificationRow> {
    const { data: result, error } = await supabase
      .from('telegram_notification')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('telegram_notification')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
