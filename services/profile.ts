import { supabase } from "../lib/supabase";

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  location: string;
  credit_balance: number;
  reputation_score: number;
  is_verified: boolean;
  last_active?: Date | string;
  created_at: Date | string;
}

export interface CreateProfileInput {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  location: string;
  credit_balance: number;
  reputation_score: number;
  is_verified: boolean;
}

export async function getProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase.from("profiles").select("*");
  if (error) throw error;
  return data;
}

export async function createProfile(profile: CreateProfileInput) {
  const { data, error } = await supabase.from("profiles").insert(profile);
  if (error) throw error;
  return data;
}

export async function updateProfile(profile: Profile) {
  const { data, error } = await supabase.from("profiles").update(profile).eq("id", profile.id);
  if (error) throw error;
  return data;
}

export async function deleteProfile(id: string) {
  const { data, error } = await supabase.from("profiles").delete().eq("id", id);
  if (error) throw error;
  return data;
}
