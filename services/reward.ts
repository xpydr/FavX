import { supabase } from "../lib/supabase";

export interface Reward {
  id: string;
  title: string;
  description?: string | null;
  price_credits: number;
  quantity_available: number;
  is_active?: boolean | null;
  image_url?: string | null;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface CreateRewardInput {
  title: string;
  description?: string | null;
  price_credits: number;
  quantity_available: number;
  is_active?: boolean | null;
  image_url?: string | null;
}

export interface RewardRedemption {
  id: string;
  user_id: string;
  reward_id: string;
  quantity: number;
  total_price: number;
  status: string;
  reward_code?: string | null;
  created_at?: Date | string;
  fulfilled_at?: Date | string;
}

export interface CreateRewardRedemptionInput {
  user_id: string;
  reward_id: string;
  quantity: number;
  total_price: number;
  status: string;
  reward_code?: string | null;
}

export async function getRewards(): Promise<Reward[]> {
  const { data, error } = await supabase.from("rewards").select("*");
  if (error) throw error;
  return data;
}

export async function createReward(reward: CreateRewardInput) {
  const { data, error } = await supabase.from("rewards").insert(reward);
  if (error) throw error;
  return data;
}

export async function updateReward(reward: Reward) {
  const { data, error } = await supabase.from("rewards").update(reward).eq("id", reward.id);
  if (error) throw error;
  return data;
}

export async function deleteReward(id: string) {
  const { data, error } = await supabase.from("rewards").delete().eq("id", id);
  if (error) throw error;
  return data;
}

export async function getRewardRedemptions(): Promise<RewardRedemption[]> {
  const { data, error } = await supabase.from("reward_redemptions").select("*");
  if (error) throw error;
  return data;
}

export async function createRewardRedemption(redemption: CreateRewardRedemptionInput) {
  const { data, error } = await supabase.from("reward_redemptions").insert(redemption);
  if (error) throw error;
  return data;
}

export async function updateRewardRedemption(redemption: RewardRedemption) {
  const { data, error } = await supabase
    .from("reward_redemptions")
    .update(redemption)
    .eq("id", redemption.id);
  if (error) throw error;
  return data;
}

export async function deleteRewardRedemption(id: string) {
  const { data, error } = await supabase.from("reward_redemptions").delete().eq("id", id);
  if (error) throw error;
  return data;
}
