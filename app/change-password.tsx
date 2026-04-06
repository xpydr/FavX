import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { supabase } from "../lib/supabase";

export default function ChangePassword() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChangePassword = async () => {
    setErrorMsg("");

    if (!password || !confirm) {
      setErrorMsg("Please fill all fields");
      return;
    }

    if (password !== confirm) {
      setErrorMsg("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        if (error.code === "same_password") {
          setErrorMsg("New password must be different from current password");
        } else {
          setErrorMsg(error.message);
        }
        return;
      }

      router.back();
    } catch (error: any) {
      setErrorMsg("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <ArrowLeft size={22} color="#15b1c9ff" />
        </Pressable>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Form Card */}
      <View style={styles.card}>
        <Text style={styles.label}>New Password</Text>
        <TextInput
          secureTextEntry
          value={password}
          onChangeText={(v) => {
            setPassword(v);
            setErrorMsg("");
          }}
          placeholder="Enter new password"
          style={styles.input}
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          secureTextEntry
          value={confirm}
          onChangeText={(v) => {
            setConfirm(v);
            setErrorMsg("");
          }}
          placeholder="Confirm password"
          style={styles.input}
        />

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
      </View>

      {/* Button */}
      <Pressable
        onPress={handleChangePassword}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.buttonText}>
          {loading ? "Updating..." : "Update Password"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingTop: 56,
    paddingHorizontal: 24,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#15b1c9ff",
    flex: 1,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
  },

  label: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 6,
  },

  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },

  errorText: {
    color: "#dc2626",
    fontSize: 13,
    marginTop: 4,
    marginLeft: 2,
  },

  button: {
    backgroundColor: "#15b1c9ff",
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonPressed: {
    transform: [{ scale: 0.97 }],
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});