import { supabase } from "../lib/supabase";

export interface Review {
  id: string;
  favour_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string;
  is_reported: boolean;
  created_at: Date | string;
}

export interface CreateReviewInput {
  favour_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string;
  is_reported: boolean;
}

export async function getReviews(): Promise<Review[]> {
  const { data, error } = await supabase.from("reviews").select("*");
  if (error) throw error;
  return data;
}

export async function createReview(review: CreateReviewInput) {
  const { data, error } = await supabase.from("reviews").insert(review);
  if (error) throw error;
  return data;
}

export async function updateReview(review: Review) {
  const { data, error } = await supabase.from("reviews").update(review).eq("id", review.id);
  if (error) throw error;
  return data;
}

export async function deleteReview(id: string) {
  const { data, error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw error;
  return data;
}
