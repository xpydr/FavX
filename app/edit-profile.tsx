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

  useEffect(() => {
    const load = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, username, location, avatar_url")
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
        setAvatarUrl(data.avatar_url || null);
      }

      setLoading(false);
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
    }
});

