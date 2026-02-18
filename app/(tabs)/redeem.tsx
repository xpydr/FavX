import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import { Image as ExpoImage } from "expo-image";
import { Star } from "lucide-react-native";

const rewardItems = [
  {
    id: "1",
    title: "Coffee Shop Voucher",
    brand: "Local Café",
    description: "Free latte or tea at participating locations.",
    points: 250,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Grocery Discount",
    brand: "Fresh Market",
    description: "$10 off your next grocery trip.",
    points: 400,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Transit Pass",
    brand: "City Transit",
    description: "Day pass for buses and subway.",
    points: 550,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1517940310602-2858c944e3ea?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Pet Store Coupon",
    brand: "Happy Paws",
    description: "$15 toward pet food or toys.",
    points: 300,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1596496181848-333Vicb3BrU?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function RedeemScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Redeem Rewards</Text>
        <View style={styles.pointsPill}>
          <Text style={styles.pointsLabel}>Your points</Text>
          <Text style={styles.pointsValue}>1,250</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>Turn your favours into real-life perks.</Text>

      {/* Grid of rewards */}
      <FlatList
        data={rewardItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Image + rating + favorite */}
            <View style={styles.cardImageWrapper}>
              <ExpoImage
                source={{ uri: item.image }}
                style={styles.cardImage}
                contentFit="cover"
              />
              <View style={styles.ratingBadge}>
                <Star size={12} color="#ffffff" fill="#ffffff" />
                <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
              </View>

            </View>

            {/* Text content */}
            <View style={styles.cardBody}>
              <Text style={styles.brandText}>{item.brand}</Text>
              <Text style={styles.titleText} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.descriptionText} numberOfLines={2}>
                {item.description}
              </Text>

              <View style={styles.cardFooter}>
                <Text style={styles.pointsText}>{item.points} pts</Text>
                <Pressable style={styles.redeemButton}>
                  <Text style={styles.redeemText}>Redeem</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
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
});
