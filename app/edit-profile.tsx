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
import * as ImagePicker from "expo-image-picker";
import { Image as ExpoImage } from "expo-image";

export default function EditProfile() {
  const { user } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [allSkills, setAllSkills] = useState<any[]>([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState<any[]>([]);

  const toggleSkill = (skillId: string) => {
    setSelectedSkillIds((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId],
    );
  };

  useEffect(() => {
    const load = async () => {
      if (!user) return;

      try {
        setLoading(true);

        const [profileRes, skillsRes, profileSkillsRes] = await Promise.all([
          supabase
            .from("profiles")
            .select("full_name, username, location, avatar_url")
            .eq("id", user.id)
            .single(),

          supabase
            .from("skills")
            .select("id, name")
            .order("name", { ascending: true }),

          supabase
            .from("profile_skills")
            .select("skill_id")
            .eq("profile_id", user.id),
        ]);

        if (profileRes.error) throw profileRes.error;
        if (skillsRes.error) throw skillsRes.error;
        if (profileSkillsRes.error) throw profileSkillsRes.error;

        if (profileRes.data) {
          setFullName(profileRes.data.full_name || "");
          setUsername(profileRes.data.username || "");
          setLocation(profileRes.data.location || "");
          setAvatarUrl(profileRes.data.avatar_url || null);
        }

        setAllSkills(skillsRes.data || []);
        setSelectedSkillIds(
          (profileSkillsRes.data || []).map((item) => item.skill_id),
        );
      } catch (error) {
        console.log("LOAD ERROR:", error);
        Alert.alert("Error", "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  const pickImage = async () => {
    if (!user) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (result.canceled) return;

    const image = result.assets[0];
    const response = await fetch(image.uri);
    const blob = await response.blob();

    const fileExt = image.uri.split(".").pop();
    const filePath = `${user.id}.${fileExt}`;

    try {
      setUploading(true);

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, blob, {
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      setAvatarUrl(data.publicUrl);
    } catch (err) {
      console.log("UPLOAD ERROR:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    if (!username.trim()) {
      Alert.alert("Validation", "Username is required");
      return;
    }

    const selectedSkills = allSkills.filter((skill) =>
      selectedSkillIds.includes(skill.id),
    );

    try {
      setSaving(true);

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          username: username.trim(),
          location: location.trim(),
          avatar_url: avatarUrl,
        })
        .eq("id", user.id);

      if (error) {
        console.log("UPDATE ERROR:", error);
        Alert.alert("Error", error.message);
        return;
      }
      // delete old skills
      const { error: deleteError } = await supabase
        .from("profile_skills")
        .delete()
        .eq("profile_id", user.id);

      if (deleteError) {
        console.log("DELETE ERROR:", deleteError);
        Alert.alert("Error", deleteError.message);
        return;
      }

      // new skills insert
      if (selectedSkillIds.length > 0) {
        const rows = selectedSkillIds.map((skillId) => ({
          profile_id: user.id,
          skill_id: skillId,
        }));

        const { error: insertError } = await supabase
          .from("profile_skills")
          .insert(rows);

        if (insertError) {
          console.log("INSERT ERROR:", insertError);
          Alert.alert("Error", insertError.message);
          return;
        }
      }

      router.replace("/profile");
    } catch (err) {
      console.log("SAVE ERROR:", err);
      Alert.alert("Error", "Something went wrong");
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
      <View style={styles.avatarWrap}>
        <Pressable onPress={pickImage}>
          <ExpoImage
            source={
              avatarUrl ? { uri: avatarUrl } : require("../assets/icon.png")
            }
            style={styles.avatar}
            contentFit="cover"
          />
        </Pressable>

        <Text style={styles.avatarHint}>
          {uploading ? "Uploading..." : "Tap to change photo"}
        </Text>
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

        <Text style={styles.label}>Skills</Text>
        <View style={styles.skillsWrap}>
          {allSkills.map((skill) => {
            const selected = selectedSkillIds.includes(skill.id);

            return (
              <Pressable
                key={skill.id}
                onPress={() => toggleSkill(skill.id)}
                style={[styles.skillChip, selected && styles.skillChipSelected]}
              >
                <Text
                  style={[
                    styles.skillChipText,
                    selected && styles.skillChipTextSelected,
                  ]}
                >
                  {skill.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
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

  avatarWrap: {
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#e5e7eb",
  },

  avatarHint: {
    marginTop: 8,
    fontSize: 12,
    color: "#6b7280",
  },
  addSkillRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  skillInput: {
    flex: 1,
  },

  addButton: {
    marginLeft: 8,
    backgroundColor: "#15b1c9ff",
    borderRadius: 10,
    height: 44,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  addButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },

  skillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  skillChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
    marginRight: 8,
    marginBottom: 8,
  },

  skillChipSelected: {
    backgroundColor: "#15b1c9ff",
    borderColor: "#15b1c9ff",
  },

  skillChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },

  skillChipTextSelected: {
    color: "#ffffff",
  },
});
