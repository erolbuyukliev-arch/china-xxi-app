import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uiqctrgucsuwdonjdvdr.supabase.co'
const supabaseAnonKey = 'sb_publishable_1Vv5XCSWTLuWWnB5jJ_vYg_jVZ-OIuG'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)