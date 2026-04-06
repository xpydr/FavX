// app/(tabs)/leaderboard.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Crown } from "lucide-react-native";
import { Image as ExpoImage } from "expo-image";

//mock data
const leaderboardData = [
  {
    id: "1",
    name: "Bryan Wolf",
    points: 43,
    avatar:
      "https://images.unsplash.com/photo-1525130413817-d45c1d127c42?q=80&w=400&auto=format&fit=crop",
    isYou: false,
  },
  {
    id: "2",
    name: "Meghan Jess",
    points: 40,
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop",
    isYou: false,
  },
  {
    id: "3",
    name: "Alex Turner",
    points: 38,
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop",
    isYou: false,
  },
  {
    id: "4",
    name: "Marsha Fisher",
    points: 36,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
    isYou: false,
  },
  {
    id: "5",
    name: "Juanita Cormier",
    points: 35,
    avatar:
      "https://images.unsplash.com/photo-1525130413817-d45c1d127c42?q=80&w=400&auto=format&fit=crop",
    isYou: false,
  },
  {
    id: "6",
    name: "You",
    points: 34,
    avatar:
      "https://i.pravatar.cc/300?img=13",
    isYou: true,
  },
  {
    id: "7",
    name: "Tamara Schmidt",
    points: 33,
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb0b90cffc6?q=80&w=400&auto=format&fit=crop",
    isYou: false,
  },
  {
    id: "8",
    name: "Ricardo Veum",
    points: 32,
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb0b90cffc7?q=80&w=400&auto=format&fit=crop",
    isYou: false,
  },
  {
    id: "9",
    name: "Gary Sanford",
    points: 31,
    avatar:
      "https://images.unsplash.com/photo-1544723795-432537d9b9b2?q=80&w=400&auto=format&fit=crop",
    isYou: false,
  },
  {
    id: "10",
    name: "Becky Bartell",
    points: 30,
    avatar:
      "https://images.unsplash.com/photo-1544005313-ff0e4b8c1a9f?q=80&w=400&auto=format&fit=crop",
    isYou: false,
  },
];

export default function LeaderboardScreen() {
  const router = useRouter();

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
        {/* 2nd place */}
        <TopUserCard user={topThree[1]} rank={2} size="small" />
        {/* 1st place */}
        <TopUserCard user={topThree[0]} rank={1} size="large" />
        {/* 3rd place */}
        <TopUserCard user={topThree[2]} rank={3} size="small" />
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
              <View
                style={[
                  styles.row,
                  highlight && styles.rowHighlight,
                ]}
              >
                <View style={styles.rowLeft}>
                  <Text
                    style={[
                      styles.rankText,
                      highlight && styles.rankTextHighlight,
                    ]}
                  >
                    {rank}
                  </Text>

                  <ExpoImage
                    source={{ uri: item.avatar }}
                    style={styles.rowAvatar}
                    contentFit="cover"
                  />

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

type TopUserCardProps = {
  user: (typeof leaderboardData)[number];
  rank: 1 | 2 | 3;
  size: "small" | "large";
};

function TopUserCard({ user, rank, size }: TopUserCardProps) {
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
        <ExpoImage
          source={{ uri: user.avatar }}
          style={{ width: avatarSize, height: avatarSize, borderRadius: 999 }}
          contentFit="cover"
        />
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
