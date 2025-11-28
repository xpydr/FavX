import { Text, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { ChevronLeft, Star, MapPin, CheckCircle } from "lucide-react-native";
import { Image } from "expo-image";

export default function PublicProfileScreen() {

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable hitSlop={20}>
            <ChevronLeft size={28} color="#11181c" />
          </Pressable>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.content}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: "https://i.pravatar.cc/300?img=13" }}
                style={styles.avatar}
                contentFit="cover"
              />
            </View>

            <View style={styles.locationRow}>
              <MapPin size={16} color="#64748b" />
              <Text style={styles.locationText}>Toronto, Ontario</Text>
            </View>

            <Text style={styles.name}>Daniel Smith</Text>
            <View style={styles.verifiedBadge}>
              <CheckCircle size={24} color="limegreen" />
            </View>

            <View style={styles.ratingRow}>
              <Star size={20} color="#fbbf24" fill="#fbbf24" />
              <Text style={styles.ratingText}>4.5</Text>
              <Pressable style={styles.followButton}>
                <Text style={styles.followText}>Follow</Text>
              </Pressable>
            </View>
          </View>

          {/* Skills */}
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsContainer}>
            {["Tech-savvy", "Friendly & approachable", "Good with animals", "Has a car"].map((skill) => (
              <View key={skill} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>200+</Text>
              <Text style={styles.statLabel}>Favours{'\n'}Completed</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statNumber}>30+</Text>
              <Text style={styles.statLabel}>Favours{'\n'}Requested</Text>
            </View>
          </View>

          {/* Reviews */}
          <Text style={styles.sectionTitle}>Verified Reviews</Text>
          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Image
                source={{ uri: "https://i.pravatar.cc/150?img=5" }}
                style={styles.reviewAvatar}
              />
              <View>
                <Text style={styles.reviewerName}>Ashley</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={16} color="#fbbf24" fill="#fbbf24" />
                  ))}
                </View>
              </View>
            </View>
            <Text style={styles.reviewText}>
              Daniel was amazing, very friendly and well spoken. I’ll definitely contact him again
            </Text>
          </View>

          {/* Extra space at bottom */}
          <View style={{ height: 120 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#11181c",
  },
  content: {
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 4,
    borderColor: "#e0f2fe",
  },
  avatar: {
    width: 100,
    height: 100,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 15,
    color: "#64748b",
  },
  name: {
    fontSize: 26,
    fontWeight: "800",
    color: "#11181c",
    marginTop: 4,
  },
  verifiedBadge: {
    position: "absolute",
    right: 20,
    top: 120,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#11181c",
  },
  followButton: {
    backgroundColor: "#ecfeff",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#15b1c9ff",
  },
  followText: {
    color: "#15b1c9ff",
    fontWeight: "700",
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#11181c",
    marginTop: 32,
    marginBottom: 12,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  skillTag: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  skillText: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 28,
    gap: 16,
  },
  statBox: {
    backgroundColor: "#15b1c9ff",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: "center",
    flex: 1,
    justifyContent: "center",  
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ffffff",
    includeFontPadding: false,
    textAlignVertical: "center",
    paddingTop: 6,  
  },
  statLabel: {
    fontSize: 14,
    color: "#ecfeff",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 20,
    includeFontPadding: false,    
  },
  reviewCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  reviewAvatar: {
    width: 44,
    height: 44,
    borderRadius: 999,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "600",
  },
  starsRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  reviewText: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 22,
    marginTop: 8,
  },
});