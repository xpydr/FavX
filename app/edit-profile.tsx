import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft } from "lucide-react-native";

export default function EditProfile() {
  const { user } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔹 load existing profile
  useEffect(() => {
    const load = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, username, location")
        .eq("id", user.id)
        .single();

      if (error) {
        console.log("LOAD ERROR:", error);
        Alert.alert("Error", "Failed to load profile");
        return;
      }

      if (data) {
        setFullName(data.full_name || "");
        setUsername(data.username || "");
        setLocation(data.location || "");
      }

      setLoading(false);
    };

    load();
  }, [user]);

  // 🔹 save profile
  const handleSave = async () => {
    if (!user) return;

    if (!username.trim()) {
      Alert.alert("Validation", "Username is required");
      return;
    }

    try {
      setSaving(true);

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          username: username.trim(),
          location: location.trim(),
        })
        .eq("id", user.id);

      if (error) {
        console.log("UPDATE ERROR:", error);
        Alert.alert("Error", error.message);
        return;
      }

      router.back(); // ✅ 돌아가면 Profile 자동 refresh됨
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#15b1c9ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <ArrowLeft size={22} color="#15b1c9ff" />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Form */}
      <View style={styles.card}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
          placeholder="Enter your full name"
        />

        <Text style={styles.label}>Username *</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          placeholder="Choose a username"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          value={location}
          onChangeText={setLocation}
          style={styles.input}
          placeholder="City, Country"
        />
      </View>

      {/* Save */}
      <Pressable
        style={[styles.saveButton, saving && { opacity: 0.7 }]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.saveText}>
          {saving ? "Saving..." : "Save Changes"}
        </Text>
      </Pressable>
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
    paddingTop: 56,
    paddingBottom: 24,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#15b1c9ff",
    textAlign: "center",
    flex: 1,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  label: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 6,
    marginTop: 12,
  },

  input: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: "#ffffff",
  },

  saveButton: {
    backgroundColor: "#15b1c9ff",
    borderRadius: 12,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  saveText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },

  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
  },
});