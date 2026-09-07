import { supabase } from './supabase'

// Supabase's free-tier egress quota has blocked the whole project outright
// (REST *and* Storage return 402) more than once. Unlike events, partners
// have no sensible bundled fallback — the list changes over time — so we
// keep the last successful response in localStorage and fall back to it
// instead of showing a hard error whenever the network/Supabase fails.
const PARTNERS_CACHE_KEY = 'bde-partners-cache'
const CATEGORIES_CACHE_KEY = 'bde-categories-cache'

function readCache(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch {
    // Storage full/unavailable (private mode) — the cache is a bonus, not
    // a requirement, so just skip it silently.
  }
}

export async function fetchPartners() {
  try {
    const { data, error } = await supabase
      .from('partners')
      .select('*, partner_categories(id, name, slug)')
      .eq('is_published', true)
      .order('name')
    if (error) throw error
    writeCache(PARTNERS_CACHE_KEY, data)
    return data
  } catch (err) {
    const cached = readCache(PARTNERS_CACHE_KEY)
    if (cached) {
      console.error('Partners unavailable, using last cached list', err)
      return cached
    }
    throw err
  }
}

export async function fetchPartnerById(id) {
  try {
    const { data, error } = await supabase
      .from('partners')
      .select('*, partner_categories(id, name, slug)')
      .eq('is_published', true)
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  } catch (err) {
    const cached = readCache(PARTNERS_CACHE_KEY)
    const match = cached?.find((partner) => partner.id === id)
    if (match) {
      console.error('Partner unavailable, using last cached copy', err)
      return match
    }
    throw err
  }
}

export async function fetchCategories() {
  try {
    const { data, error } = await supabase
      .from('partner_categories')
      .select('*')
      .order('sort_order')
    if (error) throw error
    writeCache(CATEGORIES_CACHE_KEY, data)
    return data
  } catch (err) {
    const cached = readCache(CATEGORIES_CACHE_KEY)
    if (cached) {
      console.error('Categories unavailable, using last cached list', err)
      return cached
    }
    throw err
  }
}
