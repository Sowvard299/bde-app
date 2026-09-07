import { supabase } from './supabase'
import { fallbackEventById, fallbackUpcomingEvents } from './fallbackEvents'

// Supabase can be unreachable (outage, exceeded free-tier quota). When that
// happens the app falls back to the bundled copy of the key events rather
// than showing an error page — a stale WEI page still beats no WEI page.
export async function fetchUpcomingEvents() {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_published', true)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at')

    if (error) throw error
    if (!data?.length) return fallbackUpcomingEvents()
    return data
  } catch (err) {
    console.error('Events unavailable, using bundled fallback', err)
    const fallback = fallbackUpcomingEvents()
    if (!fallback.length) throw err
    return fallback
  }
}

export async function fetchEventById(id) {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_published', true)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  } catch (err) {
    console.error('Event unavailable, using bundled fallback', err)
    const fallback = fallbackEventById(id)
    if (!fallback) throw err
    return fallback
  }
}
