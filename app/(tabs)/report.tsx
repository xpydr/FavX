import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function ReportScreen() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = () => {
    if (!message.trim()) {
      Alert.alert("Empty report", "Please describe your problem first.");
      return;
    }

    // TODO: send to backend / log etc.
    Alert.alert("Thank you!", "Your report has been submitted.");
    setMessage("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable onPress={handleBack} hitSlop={12}>
            <ArrowLeft size={22} color="#15b1c9ff" />
          </Pressable>
          <Text style={styles.headerTitle}>Report a problem</Text>
          <View style={{ width: 22 }} />
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Describe your problem in detail and send it to us.
        </Text>

        {/* Input card */}
        <View style={styles.inputCard}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            multiline
            placeholder="Describe your problem in detail..."
            placeholderTextColor="#9ca3af"
            style={styles.input}
            textAlignVertical="top"
          />
        </View>

        {/* Submit button */}
        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Send report</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  content: {
    paddingTop: 56,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#15b1c9ff",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 24,
    
  },
  inputCard: {
    
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 160,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 24,
  },
  input: {
    fontSize: 15,
    color: "#111827",
    minHeight: 130,
  },
  submitButton: {
    marginTop: 8,
    backgroundColor: "#15b1c9ff",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});

