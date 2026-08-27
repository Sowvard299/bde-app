import { supabase } from './supabase'

export async function fetchPartners() {
  const { data, error } = await supabase
    .from('partners')
    .select('*, partner_categories(id, name, slug)')
    .eq('is_published', true)
    .order('name')

  if (error) throw error
  return data
}

export async function fetchCategories() {
  const { data, error } = await supabase
    .from('partner_categories')
    .select('*')
    .order('sort_order')

  if (error) throw error
  return data
}
