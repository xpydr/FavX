import { supabase } from "../lib/supabase";

interface Favour {
  id: string;
  requester_id: string;
  helper_id?: string;
  category: string;
  title: string;
  description: string;
  type: string;
  location: string;
  latitude: string;
  longitude: string;
  status: string;
  credit_reward: string;
  posted_at: Date | string;
  accepted_at?: Date | string;
  completed_at?: Date | string;
}

export interface CreateFavourInput {
  requester_id: string;
  category: string;
  title: string;
  description: string;
  type: string;
  location: string;
  latitude: string;
  longitude: string;
  status: string;
  credit_reward: string;
}

export async function getFavours(): Promise<Favour[]> {
  const { data, error } = await supabase.from("favours").select("*");
  if (error) throw error;
  return data;
}

export async function createFavour(favour: CreateFavourInput) {
  const favourData = {
    ...favour
  };

  const { data, error } = await supabase.from("favours").insert(favourData);
  if (error) throw error;
  return data;
}

export async function updateFavour(favour: Favour) {
  const { data, error } = await supabase.from("favours").update(favour).eq("id", favour.id);
  if (error) throw error;
  return data;
}

export async function deleteFavour(id: string) {
  const { data, error } = await supabase.from("favours").delete().eq("id", id);
  if (error) throw error;
  return data;
}