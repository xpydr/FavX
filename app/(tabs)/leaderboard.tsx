import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Crown } from "lucide-react-native";
import { Image as ExpoImage } from "expo-image";
import { supabase } from "../../lib/supabase";
import { User } from "lucide-react-native";

export default function LeaderboardScreen() {
  const router = useRouter();
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    // current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUserId(user?.id ?? null);

    // fetch profiles
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, reputation_score")
      .order("reputation_score", { ascending: false })
      .limit(50);

    if (error) {
      console.error(error);
      return;
    }

    const formatted = (data || []).map((item) => ({
      id: item.id,
      name: item.full_name || "User",
      points: item.reputation_score || 0,
      avatar: item.avatar_url || null,
      isYou: item.id === user?.id,
    }));

    setLeaderboardData(formatted);
  };

  if (leaderboardData.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  const topThree = leaderboardData.slice(0, 3);
  const rest = leaderboardData.slice(3);
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <ArrowLeft size={22} color="#15b1c9ff" />
        </Pressable>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Top 3 section */}
      <View style={styles.topThreeRow}>
        {topThree[1] && (
          <TopUserCard user={topThree[1]} rank={2} size="small" />
        )}
        {topThree[0] && (
          <TopUserCard user={topThree[0]} rank={1} size="large" />
        )}
        {topThree[2] && (
          <TopUserCard user={topThree[2]} rank={3} size="small" />
        )}
      </View>

      {/* Rest of the list */}
      <View style={styles.listCard}>
        <FlatList
          data={rest}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            const rank = index + 4; // because these start at 4
            const highlight = item.isYou;

            return (
              <View style={[styles.row, highlight && styles.rowHighlight]}>
                <View style={styles.rowLeft}>
                  <Text
                    style={[
                      styles.rankText,
                      highlight && styles.rankTextHighlight,
                    ]}
                  >
                    {rank}
                  </Text>

                  {item.avatar ? (
                    <ExpoImage
                      source={{ uri: item.avatar }}
                      style={styles.rowAvatar}
                      contentFit="cover"
                    />
                  ) : (
                    <View
                      style={[
                        styles.rowAvatar,
                        {
                          backgroundColor: "#e5e7eb",
                          alignItems: "center",
                          justifyContent: "center",
                        },
                      ]}
                    >
                      <User size={16} color="#6b7280" />
                    </View>
                  )}

                  <Text
                    style={[
                      styles.nameText,
                      highlight && styles.nameTextHighlight,
                    ]}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.pointsText,
                    highlight && styles.pointsTextHighlight,
                  ]}
                >
                  {item.points} pts
                </Text>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}

function TopUserCard({
  user,
  rank,
  size,
}: {
  user: any;
  rank: number;
  size: "small" | "large";
}) {
  const isFirst = rank === 1;
  const avatarSize = size === "large" ? 88 : 70;
  const crownOffset = size === "large" ? 18 : 14;

  return (
    <View style={styles.topUserContainer}>
      {/* Crown only for #1 */}
      {isFirst && (
        <View style={[styles.crownWrapper, { top: -crownOffset }]}>
          <Crown size={26} color="#15b1c9ff" fill="#15b1c9ff" />
        </View>
      )}

      <View
        style={[
          styles.topAvatarWrapper,
          isFirst && styles.topAvatarWrapperFirst,
        ]}
      >
        {user.avatar ? (
          <ExpoImage
            source={{ uri: user.avatar }}
            style={{ width: avatarSize, height: avatarSize, borderRadius: 999 }}
            contentFit="cover"
          />
        ) : (
          <View
            style={{
              width: avatarSize,
              height: avatarSize,
              borderRadius: 999,
              backgroundColor: "#e5e7eb",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <User size={avatarSize * 0.5} color="#6b7280" />
          </View>
        )}
        <View style={styles.rankBadge}>
          <Text style={styles.rankBadgeText}>{rank}</Text>
        </View>
      </View>

      <Text
        style={[styles.topNameText, isFirst && styles.topNameTextFirst]}
        numberOfLines={1}
      >
        {user.name}
      </Text>
      <Text style={styles.topPointsText}>{user.points} pts</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingTop: 56,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#15b1c9ff",
    textAlign: "center",
    flex: 1,
  },

  // Top 3
  topThreeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  topUserContainer: {
    alignItems: "center",
    flex: 1,
  },
  topAvatarWrapper: {
    borderRadius: 999,
    padding: 3,
    backgroundColor: "#e5f6fa",
    position: "relative",
  },
  topAvatarWrapperFirst: {
    backgroundColor: "#c7f0f7",
  },
  crownWrapper: {
    position: "absolute",
    zIndex: 2,
  },
  rankBadge: {
    position: "absolute",
    bottom: -4,
    right: "50%",
    transform: [{ translateX: 10 }],
    backgroundColor: "#15b1c9ff",
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#f9fafb",
  },
  rankBadgeText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 13,
  },
  topNameText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  topNameTextFirst: {
    color: "#111827",
  },
  topPointsText: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },

  // List card
  listCard: {
    flex: 1,
    marginTop: 8,
    backgroundColor: "#e5f0f4",
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 6,
  },
  rowHighlight: {
    backgroundColor: "#bfe7f0",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rankText: {
    width: 24,
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  rankTextHighlight: {
    color: "#0f172a",
  },
  rowAvatar: {
    width: 30,
    height: 30,
    borderRadius: 999,
    marginHorizontal: 8,
  },
  nameText: {
    fontSize: 14,
    color: "#111827",
    flexShrink: 1,
  },
  nameTextHighlight: {
    fontWeight: "700",
  },
  pointsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4b5563",
  },
  pointsTextHighlight: {
    color: "#0f172a",
  },
});
