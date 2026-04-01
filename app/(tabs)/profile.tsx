import { useFocusEffect } from "@react-navigation/native";
import { Image as ExpoImage } from "expo-image";
import { useCallback, useState } from "react";
import { BadgeCheck, MapPin, Star } from "lucide-react-native";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { supabase } from "../../lib/supabase";
import { getProfileOverview, ProfileOverview } from "../../services/profile";

export default function ProfileScreen() {
  const [overview, setOverview] = useState<ProfileOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      const userId = sessionData.session?.user?.id;
      if (!userId) {
        setOverview(null);
        setError("Sign in to view your profile.");
        return;
      }

      const data = await getProfileOverview(userId);
      if (!data) {
        setError("No profile data found.");
      } else {
        setOverview(data);
      }
    } catch {
      setError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#15b1c9ff" />
      </View>
    );
  }

  if (error || !overview) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || "Profile unavailable."}</Text>
        <Pressable style={styles.retryButton} onPress={loadProfile}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  const { profile, skills, completedFavours, requestedFavours, verifiedReviews } = overview;
  const ratingPlaceholder = "N/A";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>My Profile</Text>

      <View style={styles.card}>
        <View style={styles.headerRow}>
          <ExpoImage
            source={
              profile.avatar_url
                ? { uri: profile.avatar_url }
                : require("../../assets/icon.png")
            }
            style={styles.avatar}
            contentFit="cover"
          />

          <View style={styles.headerMeta}>
            <View style={styles.locationRow}>
              <MapPin size={13} color="#6b7280" />
              <Text style={styles.locationText}>{profile.location || "Location not set"}</Text>
            </View>

            <View style={styles.nameRow}>
              <Text style={styles.name}>{profile.full_name || profile.username}</Text>
              {profile.is_verified && (
                <BadgeCheck size={16} color="#15b1c9ff" fill="#15b1c9ff" />
              )}
            </View>

            <View style={styles.ratingRow}>
              <Text style={styles.ratingValue}>{ratingPlaceholder}</Text>
              <Star size={14} color="#15b1c9ff" fill="#15b1c9ff" />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Skills</Text>
        {skills.length ? (
          <View style={styles.skillWrap}>
            {skills.map((skill) => (
              <View key={skill.id} style={styles.skillChip}>
                <Text style={styles.skillText}>{skill.name}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No skills added yet.</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Favour Activity</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{completedFavours}+</Text>
            <Text style={styles.statLabel}>Favours Completed</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{requestedFavours}+</Text>
            <Text style={styles.statLabel}>Favours Requested</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Verified Reviews</Text>
        {verifiedReviews.length ? (
          verifiedReviews.map((review) => (
            <View key={review.id} style={styles.reviewItem}>
              <View style={styles.reviewTop}>
                <ExpoImage
                  source={
                    review.reviewer_avatar_url
                      ? { uri: review.reviewer_avatar_url }
                      : require("../../assets/icon.png")
                  }
                  style={styles.reviewAvatar}
                  contentFit="cover"
                />

                <View style={styles.reviewMeta}>
                  <Text style={styles.reviewHeader}>{review.reviewer_name}</Text>
                  <Text style={styles.reviewRating}>{review.rating.toFixed(1)}</Text>
                </View>
              </View>
              <Text style={styles.reviewBody}>{review.comment || "No comment provided."}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No verified reviews yet.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  centered: {
    flex: 1,
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#15b1c9ff",
    marginBottom: 18,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#e5e7eb",
    marginRight: 10,
  },
  headerMeta: {
    flex: 1,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  locationText: {
    marginLeft: 4,
    fontSize: 13,
    color: "#6b7280",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  name: {
    fontSize: 28,
    fontWeight: "700",
    color: "#11181c",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#15b1c9ff",
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#15b1c9ff",
    marginBottom: 10,
  },
  skillWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillChip: {
    backgroundColor: "#ecfeff",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#b6f1f9",
  },
  skillText: {
    color: "#0e7490",
    fontWeight: "600",
    fontSize: 13,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#4fb8cc",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  statValue: {
    fontSize: 36,
    fontWeight: "800",
    color: "#ffffff",
    lineHeight: 40,
  },
  statLabel: {
    marginTop: 2,
    color: "#ffffff",
    fontSize: 15,
    lineHeight: 20,
  },
  reviewItem: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  reviewTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  reviewAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#e5e7eb",
    marginRight: 8,
  },
  reviewMeta: {
    flex: 1,
  },
  reviewHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1f2937",
  },
  reviewRating: {
    fontSize: 12,
    fontWeight: "700",
    color: "#15b1c9ff",
  },
  reviewBody: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 14,
    color: "#6b7280",
  },
  errorText: {
    fontSize: 16,
    color: "#b91c1c",
    marginBottom: 12,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#15b1c9ff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
});
