import { supabase } from "../lib/supabase";

export interface Conversation {
  id: string;
  created_at: Date | string;
}

export type CreateConversationInput = Record<string, never>;

export interface ConversationParticipant {
  conversation_id: string;
  user_id: string;
  joined_at: Date | string;
}

export interface CreateConversationParticipantInput {
  conversation_id: string;
  user_id: string;
}

export async function getConversations(): Promise<Conversation[]> {
  const { data, error } = await supabase.from("conversations").select("*");
  if (error) throw error;
  return data;
}

export async function createConversation(_input: CreateConversationInput = {}) {
  const { data, error } = await supabase.from("conversations").insert({});
  if (error) throw error;
  return data;
}

export async function updateConversation(conversation: Conversation) {
  const { data, error } = await supabase
    .from("conversations")
    .update(conversation)
    .eq("id", conversation.id);
  if (error) throw error;
  return data;
}

export async function deleteConversation(id: string) {
  const { data, error } = await supabase.from("conversations").delete().eq("id", id);
  if (error) throw error;
  return data;
}

export async function getConversationParticipants(
  conversationId: string
): Promise<ConversationParticipant[]> {
  const { data, error } = await supabase
    .from("conversation_participants")
    .select("*")
    .eq("conversation_id", conversationId);
  if (error) throw error;
  return data;
}

export async function createConversationParticipant(
  participant: CreateConversationParticipantInput
) {
  const { data, error } = await supabase.from("conversation_participants").insert(participant);
  if (error) throw error;
  return data;
}

export async function updateConversationParticipant(participant: ConversationParticipant) {
  const { data, error } = await supabase
    .from("conversation_participants")
    .update({ joined_at: participant.joined_at })
    .eq("conversation_id", participant.conversation_id)
    .eq("user_id", participant.user_id);
  if (error) throw error;
  return data;
}

export async function deleteConversationParticipant(
  conversationId: string,
  userId: string
) {
  const { data, error } = await supabase
    .from("conversation_participants")
    .delete()
    .eq("conversation_id", conversationId)
    .eq("user_id", userId);
  if (error) throw error;
  return data;
}
