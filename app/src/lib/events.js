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

// Les événements déjà passés de la saison, du plus récent au plus ancien.
// Ils restent en ligne : leurs fiches montrent ce que le BDE organise, et
// sans lien depuis l'agenda elles n'étaient plus reliées au reste du site
// (Google les classait alors « détectées, non indexées »). En cas de
// panne, la liste est simplement vide.
export async function fetchPastEvents(limite = 30) {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('id, title, starts_at, location_name')
      .eq('is_published', true)
      .lt('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: false })
      .limit(limite)
    if (error) throw error
    return data ?? []
  } catch (err) {
    console.error('Past events unavailable', err)
    return []
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
