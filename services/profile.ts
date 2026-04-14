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

export interface Skill {
  id: string;
  name: string;
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

export interface ProfileSkill {
  id: string;
  name: string;
}

export interface ProfileSkillAssignment {
  id: string;
  profile_id: string;
  skill_id: string;
  skill: ProfileSkill;
}

export interface VerifiedReview {
  id: string;
  rating: number;
  comment: string;
  created_at: Date | string;
  reviewer_name: string;
  reviewer_avatar_url?: string;
}

export interface ProfileOverview {
  profile: Profile;
  skills: ProfileSkill[];
  completedFavours: number;
  requestedFavours: number;
  verifiedReviews: VerifiedReview[];
  avgRating: number | null;
}

export async function getProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase.from("profiles").select("*");
  if (error) throw error;
  return data;
}

/** Fetches one profile by auth user id (`profiles.id` === `auth.users.id`). */
export async function getProfileByUserId(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
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

export async function getProfileOverview(userId: string): Promise<ProfileOverview> {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) throw profileError;
  if (!profile) throw new Error("Profile not found");

  const [requestedFavoursCount, completedFavoursCount, skills, verifiedReviews] = await Promise.all([
    getRequestedFavoursCount(userId),
    getCompletedFavoursCount(userId),
    getProfileSkills(userId),
    getVerifiedReviews(userId),
  ]);
  const avgRating =
    verifiedReviews.length > 0
      ? verifiedReviews.reduce((sum, r) => sum + r.rating, 0) / verifiedReviews.length
      : null;
  return {
    profile,
    skills,
    completedFavours: completedFavoursCount,
    requestedFavours: requestedFavoursCount,
    verifiedReviews,
    avgRating,
  };
}

async function getRequestedFavoursCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from("favours")
    .select("id", { count: "exact", head: true })
    .eq("requester_id", userId);

  if (error) throw error;
  return count ?? 0;
}

async function getCompletedFavoursCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from("favours")
    .select("id", { count: "exact", head: true })
    .eq("helper_id", userId)
    .eq("status", "completed");

  if (error) throw error;
  return count ?? 0;
}

async function getProfileSkills(userId: string): Promise<ProfileSkill[]> {
  try {
    const { data: userSkillRows, error: userSkillsError } = await supabase
      .from("profile_skills")
      .select(`
            skill:skill_id (
              id,
              name
            )
          `)
      .eq("profile_id", userId);

       if (userSkillsError) throw userSkillsError;
       return (userSkillRows ?? []).map((row) => row.skill);
     } catch (err) {
       console.log("GET PROFILE SKILLS ERROR:", err);
       return [];
     }
   }

export async function getSkillCatalog(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from("skills")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getUserSkillAssignments(userId: string): Promise<ProfileSkillAssignment[]> {
  const { data, error } = await supabase
    .from("profile_skills")
    .select(
      `
        id,
        profile_id,
        skill_id,
        skill:skill_id (
          id,
          name
        )
      `
    )
    .eq("profile_id", userId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    profile_id: row.profile_id,
    skill_id: row.skill_id,
    skill: Array.isArray(row.skill) ? row.skill[0] : row.skill,
  }));
}

export async function addUserSkill(userId: string, skillId: string): Promise<void> {
  if (!skillId) {
    throw new Error("Skill is required");
  }

  await linkSkillToUser(userId, skillId);
}

export async function updateUserSkill(userId: string, profileSkillId: string, skillId: string): Promise<void> {
  if (!skillId) {
    throw new Error("Skill is required");
  }

  const { data: existingAssignment, error: existingError } = await supabase
    .from("profile_skills")
    .select("id")
    .eq("profile_id", userId)
    .eq("skill_id", skillId)
    .maybeSingle();

  if (existingError) throw existingError;

  if (existingAssignment && existingAssignment.id !== profileSkillId) {
    const { error: deleteError } = await supabase
      .from("profile_skills")
      .delete()
      .eq("id", profileSkillId)
      .eq("profile_id", userId);

    if (deleteError) throw deleteError;
    return;
  }

  const { error } = await supabase
    .from("profile_skills")
    .update({ skill_id: skillId })
    .eq("id", profileSkillId)
    .eq("profile_id", userId);

  if (error) throw error;
}

export async function removeUserSkill(userId: string, profileSkillId: string): Promise<void> {
  const { error } = await supabase
    .from("profile_skills")
    .delete()
    .eq("id", profileSkillId)
    .eq("profile_id", userId);

  if (error) throw error;
}

async function linkSkillToUser(userId: string, skillId: string): Promise<void> {
  const { data: existingAssignment, error: existingError } = await supabase
    .from("profile_skills")
    .select("id")
    .eq("profile_id", userId)
    .eq("skill_id", skillId)
    .maybeSingle();

  if (existingError) throw existingError;
  if (existingAssignment) return;

  const { error } = await supabase.from("profile_skills").insert({
    profile_id: userId,
    skill_id: skillId,
  });

  if (error) throw error;
}

async function getVerifiedReviews(userId: string): Promise<VerifiedReview[]> {
  const { data: reviews, error: reviewsError } = await supabase
    .from("reviews")
    .select("id, favour_id, rating, comment, created_at, reviewer_id, reviewee_id, is_reported")
    .eq("reviewee_id", userId)
    .eq("is_reported", false)
    .order("created_at", { ascending: false })
    .limit(20);

  if (reviewsError) throw reviewsError;
  if (!reviews?.length) return [];

  const favourIds = reviews.map((review) => review.favour_id);
  const reviewerIds = reviews.map((review) => review.reviewer_id);

  const { data: favours, error: favoursError } = await supabase
    .from("favours")
    .select("id, requester_id, helper_id, status, completed_at")
    .in("id", favourIds);

  if (favoursError) throw favoursError;

  const favourMap = new Map((favours ?? []).map((favour) => [favour.id, favour]));

  const { data: reviewers, error: reviewerError } = await supabase
    .from("profiles")
    .select("id, full_name, username, avatar_url")
    .in("id", reviewerIds);

  if (reviewerError) throw reviewerError;

  const reviewerMap = new Map(
    (reviewers ?? []).map((reviewer) => [
      reviewer.id,
      {
        name: reviewer.full_name || reviewer.username || "Unknown user",
        avatarUrl: reviewer.avatar_url || undefined,
      },
    ])
  );

  return reviews
    .filter((review) => {
      const favour = favourMap.get(review.favour_id);
      if (!favour) return false;

      const isCompleted = favour.status === "completed" || Boolean(favour.completed_at);
      if (!isCompleted) return false;

      const reviewerIsParticipant =
        review.reviewer_id === favour.requester_id || review.reviewer_id === favour.helper_id;
      const revieweeIsParticipant =
        review.reviewee_id === favour.requester_id || review.reviewee_id === favour.helper_id;

      return reviewerIsParticipant && revieweeIsParticipant;
    })
    .slice(0, 8)
    .map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      created_at: review.created_at,
      reviewer_name: reviewerMap.get(review.reviewer_id)?.name || "Unknown user",
      reviewer_avatar_url: reviewerMap.get(review.reviewer_id)?.avatarUrl,
    }));
}
