
import { supabase } from '@/integrations/supabase/client'

export class User {
  static async me() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')
    
    return {
      id: user.id,
      email: user.email || ''
    }
  }
}
