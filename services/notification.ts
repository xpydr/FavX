import { supabase } from "../lib/supabase";

export interface Notification {
  id: string;
  user_id: string;
  favour_id: string;
  type: string;
  message: string;
  is_read: boolean;
  read_at?: Date | string;
  created_at: Date | string;
}

export interface CreateNotificationInput {
  user_id: string;
  favour_id: string;
  type: string;
  message: string;
  is_read: boolean;
}

export async function getNotifications(): Promise<Notification[]> {
  const { data, error } = await supabase.from("notifications").select("*");
  if (error) throw error;
  return data;
}

export async function createNotification(notification: CreateNotificationInput) {
  const { data, error } = await supabase.from("notifications").insert(notification);
  if (error) throw error;
  return data;
}

export async function updateNotification(notification: Notification) {
  const { data, error } = await supabase
    .from("notifications")
    .update(notification)
    .eq("id", notification.id);
  if (error) throw error;
  return data;
}

export async function deleteNotification(id: string) {
  const { data, error } = await supabase.from("notifications").delete().eq("id", id);
  if (error) throw error;
  return data;
}
