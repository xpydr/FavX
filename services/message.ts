import { supabase } from "../lib/supabase";

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: Date | string;
}

export interface CreateMessageInput {
  conversation_id: string;
  sender_id: string;
  content: string;
}

export async function getMessages(): Promise<Message[]> {
  const { data, error } = await supabase.from("messages").select("*");
  if (error) throw error;
  return data;
}

export async function createMessage(message: CreateMessageInput) {
  const { data, error } = await supabase.from("messages").insert(message);
  if (error) throw error;
  return data;
}

export async function updateMessage(message: Message) {
  const { data, error } = await supabase.from("messages").update(message).eq("id", message.id);
  if (error) throw error;
  return data;
}

export async function deleteMessage(id: string) {
  const { data, error } = await supabase.from("messages").delete().eq("id", id);
  if (error) throw error;
  return data;
}
