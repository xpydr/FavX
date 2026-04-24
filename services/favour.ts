import { supabase } from "../lib/supabase";
export interface Favour {
  id: string;
  requester_id: string;
  helper_id?: string;
  category: string;
  title: string;
  description: string;
  type: string;
  location: string;
  latitude: number;
  longitude: number;
  status: string;
  credit_reward: number;
  posted_at: Date | string;
  expires_at?: Date | string | null;
  accepted_at?: Date | string;
  completed_at?: Date | string;
  images?: string[] | null;
}

export interface FavourDetails extends Favour {
  requester_name: string;
  requester_avatar_url?: string;
  requester_is_verified: boolean;
  requester_reputation_score?: number;
}

export interface CreateFavourInput {
  requester_id: string;
  category: string;
  title: string;
  description: string;
  type: string;
  location: string;
  latitude: number;
  longitude: number;
  status: string;
  credit_reward: number;
  images?: string[] | null;
}

export async function getFavours(): Promise<Favour[]> {
  const { data, error } = await supabase
    .from("favours")
    .select(
      "id, requester_id, helper_id, category, title, description, type, location, latitude, longitude, status, credit_reward, posted_at, expires_at, accepted_at, completed_at, images",
    );
  if (error) throw error;
  return data;
}

export async function getFavourDetailsById(id: string): Promise<FavourDetails> {
  const { data: favour, error: favourError } = await supabase
    .from("favours")
    .select("*")
    .eq("id", id)
    .single();

  if (favourError) throw favourError;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, username, avatar_url, is_verified, reputation_score")
    .eq("id", favour.requester_id)
    .maybeSingle();

  if (profileError) throw profileError;

  const requesterName =
    profile?.full_name || profile?.username || "Unknown user";

  return {
    ...favour,
    requester_name: requesterName,
    requester_avatar_url: profile?.avatar_url || undefined,
    requester_is_verified: Boolean(profile?.is_verified),
    requester_reputation_score: profile?.reputation_score ?? undefined,
  };
}

export async function createFavour(favour: CreateFavourInput) {
  const favourData = {
    ...favour,
  };

  const { data, error } = await supabase.from("favours").insert(favourData);
  if (error) throw error;
  return data;
}

export async function updateFavour(favour: Favour) {
  const { data, error } = await supabase
    .from("favours")
    .update(favour)
    .eq("id", favour.id);
  if (error) throw error;
  return data;
}

export async function deleteFavour(id: string) {
  const { data, error } = await supabase.from("favours").delete().eq("id", id);
  if (error) throw error;
  return data;
}

export async function getOpenFavoursByUser(userId: string): Promise<Favour[]> {
  const { data, error } = await supabase
    .from("favours")
    .select("*")
    .eq("requester_id", userId)
    .eq("status", "requested")
    .order("posted_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getInProgressFavoursAsRequester(userId: string): Promise<Favour[]> {
  const { data, error } = await supabase
    .from("favours")
    .select("*")
    .eq("requester_id", userId)
    .eq("status", "accepted")
    .order("accepted_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getInProgressFavoursAsHelper(userId: string): Promise<Favour[]> {
  const { data, error } = await supabase
    .from("favours")
    .select("*")
    .eq("helper_id", userId)
    .eq("status", "accepted")
    .order("accepted_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getClosedFavoursAsRequester(userId: string): Promise<Favour[]> {
  const { data, error } = await supabase
    .from("favours")
    .select("*")
    .eq("requester_id", userId)
    .in("status", ["completed", "expired"])
    .order("posted_at", { ascending: false });
 
  if (error) throw error;
  return data;
}

export async function getClosedFavoursAsHelper(userId: string): Promise<Favour[]> {
  const { data, error } = await supabase
    .from("favours")
    .select("*")
    .eq("helper_id", userId)
    .in("status", ["completed", "expired"])
    .order("posted_at", { ascending: false });
 
  if (error) throw error;
  return data;
}

