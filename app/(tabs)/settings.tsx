import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { Image as ExpoImage } from "expo-image";
import {
  ArrowLeft,
  User,
  KeyRound,
  Bell,
  Globe2,
  ChevronRight,
} from "lucide-react-native";

export default function SettingsScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <ArrowLeft size={22} color="#15b1c9ff" />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Profile card */}
      <Pressable style={styles.profileCard} onPress={() => { /* router.push("/(tabs)/profile") */ }}>
        <View style={styles.profileLeft}>
          <ExpoImage
            source={{
              uri: "https://i.pravatar.cc/300?img=13",
            }}
            style={styles.avatar}
            contentFit="cover"
          />
          <View>
            <Text style={styles.profileName}>You</Text>
            <Text style={styles.profileSubtitle}>Edit personal details</Text>
          </View>
        </View>
        <ChevronRight size={20} color="#9ca3af" />
      </Pressable>

      {/* Settings options */}
      <View style={styles.card}>
        {/* Edit Profile */}
        <Pressable
          style={styles.row}
          onPress={() => { /* router.push("/(tabs)/profile") */ }}
        >
          <View style={styles.rowLeft}>
            <View style={styles.iconCircle}>
              <User size={18} color="#15b1c9ff" />
            </View>
            <Text style={styles.rowLabel}>Edit Profile</Text>
          </View>
          <ChevronRight size={18} color="#9ca3af" />
        </Pressable>

        {/* Change Password */}
        <Pressable
          style={styles.row}
          onPress={() => { /* router.push("/change-password") */ }}
        >
          <View style={styles.rowLeft}>
            <View style={styles.iconCircle}>
              <KeyRound size={18} color="#15b1c9ff" />
            </View>
            <Text style={styles.rowLabel}>Change Password</Text>
          </View>
          <ChevronRight size={18} color="#9ca3af" />
        </Pressable>

        {/* Notifications toggle */}
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <View style={styles.iconCircle}>
              <Bell size={18} color="#15b1c9ff" />
            </View>
            <Text style={styles.rowLabel}>Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            thumbColor={notificationsEnabled ? "#15b1c9ff" : "#f9fafb"}
            trackColor={{ false: "#e5e7eb", true: "#bfe7f0" }}
          />
        </View>

        {/* Language */}
        <Pressable
          style={styles.row}
          onPress={() => { /* router.push("/language") */ }}
        >
          <View style={styles.rowLeft}>
            <View style={styles.iconCircle}>
              <Globe2 size={18} color="#15b1c9ff" />
            </View>
            <Text style={styles.rowLabel}>Language</Text>
          </View>
          <ChevronRight size={18} color="#9ca3af" />
        </Pressable>
      </View>
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

  // Profile
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  profileLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 12,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  profileSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },

  // Settings list
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e0f7fb",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rowLabel: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "500",
  },
});
