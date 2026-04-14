import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Image as ExpoImage } from "expo-image";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";

export default function RedeemScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    const loadRewards = async () => {
      try {
        const { data, error } = await supabase
          .from("rewards")
          .select("*")
          .eq("is_active", true);

        if (error) {
          console.log("REWARDS ERROR:", error);
          return;
        }

        setRewards(data || []);
      } catch (err) {
        console.log("REWARDS FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    loadRewards();
  }, []);

  useEffect(() => {
    const loadCredits = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("credit_balance")
        .eq("id", user.id)
        .single();

      if (error) {
        console.log("CREDITS ERROR:", error);
        return;
      }

      setCredits(data?.credit_balance || 0);
    };

    loadCredits();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#15b1c9ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Redeem Rewards</Text>
        <View style={styles.pointsPill}>
          <Text style={styles.pointsLabel}>Your points</Text>
          <Text style={styles.pointsValue}>
            {credits !== null ? credits.toLocaleString() : "..."}
          </Text>
        </View>
      </View>

      <Text style={styles.subtitle}>
        Turn your favours into real-life perks.
      </Text>

      {/* Grid of rewards */}
      <FlatList
        data={rewards}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isOutOfStock = item.quantity_available === 0;

          return (
            <View style={styles.card}>
              {/* Image */}
              <View style={styles.cardImageWrapper}>
                <ExpoImage
                  source={{ uri: item.image_url }}
                  style={styles.cardImage}
                  contentFit="cover"
                />
              </View>

              {/* Content */}
              <View style={styles.cardBody}>
                <Text style={styles.brandText}>Reward</Text>

                <Text style={styles.titleText} numberOfLines={1}>
                  {item.title}
                </Text>

                <Text style={styles.descriptionText} numberOfLines={2}>
                  {item.description}
                </Text>

                <View style={styles.cardFooter}>
                  <Text style={styles.pointsText}>
                    {item.price_credits} pts
                  </Text>

                  <Pressable
                    style={[
                      styles.redeemButton,
                      isOutOfStock && styles.disabledButton,
                    ]}
                    disabled={isOutOfStock}
                    onPress={() => {
                      if (isOutOfStock) return;
                      console.log("Redeem:", item.id);
                    }}
                  >
                    <Text style={styles.redeemText}>
                      {isOutOfStock ? "Sold Out" : "Redeem"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const CARD_RADIUS = 18;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingTop: 56,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#15b1c9ff",
  },
  pointsPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#e0f7fb",
    alignItems: "flex-end",
  },
  pointsLabel: {
    fontSize: 11,
    color: "#0f172a",
  },
  pointsValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#15b1c9ff",
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 12,
    fontSize: 13,
    color: "#6b7280",
  },
  listContent: {
    paddingBottom: 24,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: CARD_RADIUS,
    marginBottom: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImageWrapper: {
    position: "relative",
    height: 110,
    backgroundColor: "#e5e7eb",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  ratingBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#15b1c9ff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 11,
    color: "#ffffff",
    fontWeight: "600",
  },
  cardBody: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  brandText: {
    fontSize: 11,
    color: "#9ca3af",
    marginBottom: 2,
  },
  titleText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  descriptionText: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  pointsText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#15b1c9ff",
  },
  redeemButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#15b1c9ff",
  },
  redeemText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#ffffff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  disabledButton: {
    backgroundColor: "#9ca3af",
  },
});
