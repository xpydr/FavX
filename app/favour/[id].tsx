import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image as ExpoImage } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { BadgeCheck, ChevronLeft, Star } from "lucide-react-native";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { FavourDetails, getFavourDetailsById } from "../../services/favour";

export default function FavourDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [favour, setFavour] = useState<FavourDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Missing favour id.");
      setLoading(false);
      return;
    }

    let isMounted = true;

    getFavourDetailsById(id)
      .then((data) => {
        if (isMounted) {
          setFavour(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError("Failed to load favour details.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#15b1c9ff" />
      </View>
    );
  }

  if (error || !favour) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || "Favour not found."}</Text>
      </View>
    );
  }

  const rating = "N/A";

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={12}>
          <ChevronLeft size={18} color="#15b1c9ff" />
          <Text style={styles.backText}>Favour Details</Text>
        </Pressable>

        <View style={styles.card}>
          <ExpoImage
            source={require("../../assets/icon.png")}
            contentFit="cover"
            style={styles.heroImage}
          />

          <Text style={styles.caption}>Favour requested by</Text>

          <View style={styles.requesterRow}>
            <ExpoImage
              source={
                favour.requester_avatar_url
                  ? { uri: favour.requester_avatar_url }
                  : require("../../assets/icon.png")
              }
              style={styles.avatar}
              contentFit="cover"
            />

            <View style={styles.requesterMeta}>
              <View style={styles.requesterNameRow}>
                <Text style={styles.requesterName}>{favour.requester_name}</Text>
                {favour.requester_is_verified && (
                  <BadgeCheck size={15} color="#22c55e" fill="#22c55e" />
                )}
              </View>

              <View style={styles.ratingRow}>
                <Star size={14} color="#15b1c9ff" fill="#15b1c9ff" />
                <Text style={styles.ratingText}>{rating} (placeholder)</Text>
              </View>
            </View>
          </View>

          <View style={styles.metaBlock}>
            <Text style={styles.metaLine}>{favour.location}</Text>
            <Text style={styles.metaLine}>{favour.category}</Text>
          </View>

          <Text style={styles.sectionTitle}>Favour Description</Text>
          <Text style={styles.description}>{favour.description}</Text>

          <Pressable onPress={() => Alert.alert("Coming soon", "Accept flow will be wired next.")}>
            <LinearGradient
              colors={["#4fb8cc", "#239ab2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.acceptButton}
            >
              <Text style={styles.acceptButtonText}>Accept Favour</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 56,
    paddingBottom: 36,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  backText: {
    marginLeft: 4,
    fontSize: 30,
    fontWeight: "600",
    color: "#15b1c9ff",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  heroImage: {
    width: "100%",
    height: 142,
    borderRadius: 10,
    marginBottom: 12,
  },
  caption: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
  },
  requesterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#e5e7eb",
    marginRight: 8,
  },
  requesterMeta: {
    flex: 1,
  },
  requesterNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  requesterName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#11181c",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    gap: 4,
  },
  ratingText: {
    color: "#15b1c9ff",
    fontWeight: "600",
    fontSize: 14,
  },
  metaBlock: {
    marginBottom: 14,
  },
  metaLine: {
    fontSize: 13,
    color: "#1f2937",
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 26,
    color: "#15b1c9ff",
    fontWeight: "600",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4b5563",
    marginBottom: 14,
  },
  acceptButton: {
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  acceptButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 16,
    color: "#b91c1c",
    textAlign: "center",
  },
});
