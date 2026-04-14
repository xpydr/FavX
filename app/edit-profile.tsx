import { useEffect, useMemo, useState } from "react";
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
import { ArrowLeft, PencilLine, Plus, Trash2, X } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { Image as ExpoImage } from "expo-image";
import {
  addUserSkill,
  getSkillCatalog,
  getUserSkillAssignments,
  ProfileSkillAssignment,
  removeUserSkill,
  Skill,
  updateUserSkill,
} from "../services/profile";

export default function EditProfile() {
  const { user } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [location, setLocation] = useState("");
  const [skillName, setSkillName] = useState("");
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [editingSkill, setEditingSkill] = useState<ProfileSkillAssignment | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skillsSaving, setSkillsSaving] = useState(false);
  const [accessError, setAccessError] = useState<string | null>(null);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [skills, setSkills] = useState<ProfileSkillAssignment[]>([]);
  const [skillCatalog, setSkillCatalog] = useState<Skill[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setAccessError("Sign in to edit your profile.");
        setLoading(false);
        return;
      }

      try {
        const [{ data, error }, userSkills, catalog] = await Promise.all([
          supabase
            .from("profiles")
            .select("full_name, username, location, avatar_url")
            .eq("id", user.id)
            .single(),
          getUserSkillAssignments(user.id),
          getSkillCatalog(),
        ]);

        if (error) {
          console.log("LOAD ERROR:", error);
          Alert.alert("Error", "Failed to load profile");
          return;
        }

        if (data) {
          setFullName(data.full_name || "");
          setUsername(data.username || "");
          setLocation(data.location || "");
          setAvatarUrl(data.avatar_url || null);
        }

        setSkills(userSkills);
        setSkillCatalog(catalog);
        setAccessError(null);
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

     const { data } = supabase.storage
       .from("avatars")
       .getPublicUrl(filePath);

     setAvatarUrl(data.publicUrl);
   } catch (err) {
     console.log("UPLOAD ERROR:", err);
      Alert.alert("Error", "Failed to upload image");
   } finally {
     setUploading(false);
   }
 };

  const resetSkillForm = () => {
    setSkillName("");
    setSelectedSkillId(null);
    setEditingSkill(null);
  };

  const handleSkillInputChange = (value: string) => {
    setSkillName(value);

    const normalized = value.trim().toLowerCase();
    const exactMatch = skillCatalog.find((skill) => skill.name.trim().toLowerCase() === normalized);

    setSelectedSkillId(exactMatch?.id ?? null);
  };

  const filteredSkills = useMemo(() => {
    const query = skillName.trim().toLowerCase();
    if (!query) return [];

    const assignedSkillIds = new Set(skills.map((skill) => skill.skill_id));
    const editingSkillId = editingSkill?.skill_id;

    return skillCatalog
      .filter((skill) => skill.name.toLowerCase().includes(query))
      .filter((skill) => !assignedSkillIds.has(skill.id) || skill.id === editingSkillId)
      .slice(0, 8);
  }, [editingSkill?.skill_id, skillCatalog, skillName, skills]);

  const hasExactSelectedSkill = Boolean(
    selectedSkillId &&
      skillCatalog.some(
        (skill) =>
          skill.id === selectedSkillId &&
          skill.name.trim().toLowerCase() === skillName.trim().toLowerCase()
      )
  );

  const showSkillSuggestions = skillName.trim().length > 0 && filteredSkills.length > 0 && !hasExactSelectedSkill;

  const pickSuggestedSkill = (skill: Skill) => {
    setSkillName(skill.name);
    setSelectedSkillId(skill.id);
  };

  const handleAddOrUpdateSkill = async () => {
    if (!user) return;

    if (!selectedSkillId) {
      Alert.alert("Validation", "Please choose a skill from the suggestions.");
      return;
    }

    try {
      setSkillsSaving(true);

      if (editingSkill) {
        await updateUserSkill(user.id, editingSkill.id, selectedSkillId);
      } else {
        await addUserSkill(user.id, selectedSkillId);
      }

      const refreshedSkills = await getUserSkillAssignments(user.id);
      setSkills(refreshedSkills);
      resetSkillForm();
    } catch (error) {
      console.log("SKILL SAVE ERROR:", error);
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to save skill");
    } finally {
      setSkillsSaving(false);
    }
  };

  const beginEditSkill = (skill: ProfileSkillAssignment) => {
    setEditingSkill(skill);
    setSkillName(skill.skill?.name ?? "");
    setSelectedSkillId(skill.skill_id);
  };

  const confirmRemoveSkill = (skill: ProfileSkillAssignment) => {
    if (!user) return;

    Alert.alert("Remove skill", `Remove ${skill.skill?.name ?? "this skill"} from your profile?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            setSkillsSaving(true);
            await removeUserSkill(user.id, skill.id);
            setSkills((currentSkills) => currentSkills.filter((item) => item.id !== skill.id));
            if (editingSkill?.id === skill.id) {
              resetSkillForm();
            }
          } catch (error) {
            console.log("SKILL DELETE ERROR:", error);
            Alert.alert("Error", "Failed to delete skill");
          } finally {
            setSkillsSaving(false);
          }
        },
      },
    ]);
  };

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
          avatar_url: avatarUrl,
        })
        .eq("id", user.id);

      if (error) {
        console.log("UPDATE ERROR:", error);
        Alert.alert("Error", error.message);
        return;
      }

      router.back();
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

  if (accessError) {
    return (
      <View style={styles.centered}>
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{accessError}</Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
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
            avatarUrl
              ? { uri: avatarUrl }
              : require("../assets/icon.png")
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
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <Text style={styles.sectionHint}>Saved instantly</Text>
        </View>

        {skills.length ? (
          <View style={styles.skillList}>
            {skills.map((skill) => (
              <View key={skill.id} style={styles.skillRow}>
                <View style={styles.skillChip}>
                  <Text style={styles.skillText}>{skill.skill?.name || "Unknown skill"}</Text>
                </View>

                <View style={styles.skillActions}>
                  <Pressable
                    style={[styles.skillActionButton, styles.skillEditButton]}
                    onPress={() => beginEditSkill(skill)}
                    disabled={skillsSaving}
                  >
                    <PencilLine size={15} color="#0e7490" />
                  </Pressable>

                  <Pressable
                    style={[styles.skillActionButton, styles.skillDeleteButton]}
                    onPress={() => confirmRemoveSkill(skill)}
                    disabled={skillsSaving}
                  >
                    <Trash2 size={15} color="#b91c1c" />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No skills added yet.</Text>
        )}

        <Text style={[styles.label, { marginTop: 16 }]}>{editingSkill ? "Update Skill" : "Add Skill"}</Text>
        <TextInput
          value={skillName}
          onChangeText={handleSkillInputChange}
          style={styles.input}
          placeholder="Search skills"
          autoCapitalize="words"
        />

        {showSkillSuggestions ? (
          <View style={styles.suggestionsList}>
            {filteredSkills.map((skill) => (
              <Pressable
                key={skill.id}
                style={styles.suggestionItem}
                onPress={() => pickSuggestedSkill(skill)}
              >
                <Text style={styles.suggestionText}>{skill.name}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        {skillName.trim().length > 0 && !selectedSkillId ? (
          <Text style={styles.selectionHint}>Pick one skill from the suggestions list.</Text>
        ) : null}

        <View style={styles.skillFormActions}>
          {editingSkill ? (
            <Pressable style={styles.cancelSkillButton} onPress={resetSkillForm} disabled={skillsSaving}>
              <X size={16} color="#0f172a" />
              <Text style={styles.cancelSkillText}>Cancel</Text>
            </Pressable>
          ) : (
            <View />
          )}

          <Pressable
            style={[styles.addSkillButton, skillsSaving && { opacity: 0.75 }]}
            onPress={handleAddOrUpdateSkill}
            disabled={skillsSaving}
          >
            <Plus size={16} color="#ffffff" />
            <Text style={styles.addSkillText}>
              {skillsSaving ? "Saving..." : editingSkill ? "Update" : "Add"}
            </Text>
          </Pressable>
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

  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#15b1c9ff",
  },

  sectionHint: {
    fontSize: 12,
    color: "#6b7280",
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

  skillList: {
    gap: 10,
  },

  skillRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  skillActions: {
    flexDirection: "row",
    gap: 8,
  },

  skillActionButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  skillEditButton: {
    backgroundColor: "#ecfeff",
    borderColor: "#b6f1f9",
  },

  skillDeleteButton: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
  },

  skillChip: {
    flex: 1,
    backgroundColor: "#ecfeff",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#b6f1f9",
  },

  skillText: {
    color: "#0e7490",
    fontWeight: "600",
    fontSize: 13,
  },

  skillFormActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
    gap: 12,
  },

  cancelSkillButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f8fafc",
  },

  cancelSkillText: {
    color: "#0f172a",
    fontWeight: "700",
  },

  addSkillButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#15b1c9ff",
    borderRadius: 12,
    height: 42,
  },

  addSkillText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },

  suggestionsList: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },

  suggestionItem: {
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },

  suggestionText: {
    fontSize: 14,
    color: "#0f172a",
  },

  selectionHint: {
    marginTop: 8,
    fontSize: 12,
    color: "#b45309",
  },

  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
    padding: 24,
  },

  errorBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  errorText: {
    fontSize: 16,
    color: "#b91c1c",
    textAlign: "center",
  },

  backButton: {
    backgroundColor: "#15b1c9ff",
    borderRadius: 12,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  backButtonText: {
    color: "#fff",
    fontWeight: "700",
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
    }
});

