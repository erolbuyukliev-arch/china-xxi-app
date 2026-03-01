// src/services/authService.js

import { supabase } from './supabaseClient'

export async function register(email, password) {
  return await supabase.auth.signUp({ email, password })
}

export async function login(email, password) {
  return await supabase.auth.signInWithPassword({ email, password })
}

export async function logout() {
  return await supabase.auth.signOut()
}

export async function getUser() {
  const { data } = await supabase.auth.getUser()
  return data.user
}