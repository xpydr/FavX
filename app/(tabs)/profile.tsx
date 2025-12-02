import { Text, Pressable, ScrollView, StyleSheet, View, Modal, TextInput } from "react-native";
import { ChevronLeft, Star, MapPin, CheckCircle } from "lucide-react-native";
import { Image } from "expo-image";
import { useState } from "react";

export default function PublicProfileScreen() {
  // Mock skills
  const [skills, setSkills] = useState([
    "Tech-savvy",
    "Friendly & approachable",
    "Good with animals",
    "Has a car",
  ]);

  const [selectedSkillIndex, setSelectedSkillIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    if (skills.length >= 10) return;
    if (trimmed.length > 30) return;

    setSkills([...skills, trimmed]);
    setNewSkill("");
    setShowModal(false);
  }

  const deleteSkill = (index: number) => {
    const updated = [...skills];
    updated.splice(index, 1);
    setSkills(updated);
    setSelectedSkillIndex(null);
  }

  type Review = {
    id: string;
    name: string;
    avatar: string;
    stars: number;
    text: string;
    date: string; // ISO
  }

  // Mock reviews
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      name: "Ashley",
      avatar: "https://i.pravatar.cc/150?img=5",
      stars: 5,
      text: "Daniel was amazing, very friendly and well spoken. I’ll definitely contact him again.",
      date: "2025-06-10",
    },
    {
      id: "2",
      name: "Mike",
      avatar: "https://i.pravatar.cc/150?img=7",
      stars: 4,
      text: "Helpful and punctual. Would hire again.",
      date: "2025-01-22",
    },
    {
      id: "3",
      name: "Sophia",
      avatar: "https://i.pravatar.cc/150?img=23",
      stars: 5,
      text: "Super friendly and great communication.",
      date: "2024-12-30",
    },
    {
      id: "4",
      name: "Kevin",
      avatar: "https://i.pravatar.cc/150?img=9",
      stars: 3,
      text: "Did the job but arrived a bit late.",
      date: "2024-11-18",
    }
  ]);

  const [filterStars, setFilterStars] = useState<number | null>(null);
  const [sortNewest, setSortNewest] = useState(true);

  const filteredReviews = reviews
    .filter((review) => (filterStars ? review.stars === filterStars : true))
    .sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return sortNewest ? db - da : da - db;
    });

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

          {/* Skills Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {skills.length < 10 && (
              <Pressable onPress={() => setShowModal(true)} hitSlop={10}>
                <Text style={styles.addSkillPlus}>＋</Text>
              </Pressable>
            )}
          </View>

          {/* Skills List */}
          <View style={styles.skillsContainer}>
            {skills.map((skill, index) => (
              <Pressable
                key={skill}
                onPress={() => setSelectedSkillIndex(index === selectedSkillIndex ? null : index)}
                style={[styles.skillTag, { position: "relative" }]}
              >
                <Text style={styles.skillText}>{skill}</Text>

                {selectedSkillIndex === index && (
                  <Pressable
                    onPress={() => deleteSkill(index)}
                    style={styles.deleteBtn}
                    hitSlop={10}
                  >
                    <Text style={styles.deleteX}>×</Text>
                  </Pressable>
                )}
              </Pressable>
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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Verified Reviews</Text>

            {/* Sort */}
            <Pressable onPress={() => setSortNewest(!sortNewest)} hitSlop={10}>
              <Text style={styles.sortText}>
                {sortNewest ? "Newest ↓" : "Oldest ↑"}
              </Text>
            </Pressable>
          </View>

          {/* Filter by star count */}
          <View style={styles.starFilterRow}>
            {[5, 4, 3, 2, 1].map((star) => (
              <Pressable
                key={star}
                onPress={() => setFilterStars(filterStars === star ? null : star)}
                style={[
                  styles.starFilterBtn,
                  filterStars === star && styles.starFilterBtnActive,
                ]}
              >
                <Text style={styles.starFilterText}>{star}★</Text>
              </Pressable>
            ))}
          </View>

          {/* Filtered sorted reviews */}
          {filteredReviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Image source={{ uri: review.avatar }} style={styles.reviewAvatar} />

                <View>
                  <Text style={styles.reviewerName}>{review.name}</Text>

                  <View style={styles.starsRow}>
                    {Array.from({ length: review.stars }).map((_, i) => (
                      <Star key={i} size={16} color="#fbbf24" fill="#fbbf24" />
                    ))}
                  </View>
                </View>
              </View>

              <Text style={styles.reviewText}>{review.text}</Text>
              <Text style={styles.reviewDate}>
                {new Date(review.date).toLocaleDateString()}
              </Text>
            </View>
          ))}

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Skill Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Skill</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter skill..."
              maxLength={30}
              value={newSkill}
              onChangeText={setNewSkill}
            />

            <View style={styles.modalButtons}>
              <Pressable onPress={() => setShowModal(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>

              <Pressable onPress={addSkill} style={styles.saveBtn}>
                <Text style={styles.saveText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 32,
    marginBottom: 12,
  },

  addSkillPlus: {
    fontSize: 28,
    fontWeight: "700",
    color: "#11181c",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#11181c",
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
    color: "#fff",
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
  reviewDate: {
    marginTop: 6,
    fontSize: 12,
    color: "#64748b",
  },
  sortText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },

  starFilterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  starFilterBtn: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#fff",
  },
  starFilterBtnActive: {
    backgroundColor: "#15b1c9ff",
    borderColor: "#15b1c9ff",
  },
  starFilterText: {
    color: "#11181c",
    fontWeight: "600",
    fontSize: 14,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#11181c",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    padding: 12,
    borderRadius: 8,
    fontSize: 15,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cancelText: {
    color: "#64748b",
    fontSize: 15,
    fontWeight: "600",
  },
  saveBtn: {
    backgroundColor: "#15b1c9ff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  deleteBtn: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#ef4444",
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteX: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
    lineHeight: 14,
  },
});
