import { supabase } from './supabase'

export async function fetchUpcomingEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .gte('starts_at', new Date().toISOString())
    .order('starts_at')

  if (error) throw error
  return data
}

export async function fetchEventById(id) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}
