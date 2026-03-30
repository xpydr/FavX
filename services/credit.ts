import { supabase } from "../lib/supabase";

export interface Credit {
  id: string;
  user_id: string;
  favour_id: string;
  amount: number;
  transaction_type: string;
  description: string;
  created_at: Date | string;
}

export interface CreateCreditInput {
  user_id: string;
  favour_id: string;
  amount: number;
  transaction_type: string;
  description: string;
}

export async function getCredits(): Promise<Credit[]> {
  const { data, error } = await supabase.from("credits").select("*");
  if (error) throw error;
  return data;
}

export async function createCredit(credit: CreateCreditInput) {
  const { data, error } = await supabase.from("credits").insert(credit);
  if (error) throw error;
  return data;
}

export async function updateCredit(credit: Credit) {
  const { data, error } = await supabase.from("credits").update(credit).eq("id", credit.id);
  if (error) throw error;
  return data;
}

export async function deleteCredit(id: string) {
  const { data, error } = await supabase.from("credits").delete().eq("id", id);
  if (error) throw error;
  return data;
}
