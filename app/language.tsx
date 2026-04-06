import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Check } from "lucide-react-native";

type LanguageOption = "en" | "fr-CA";

export default function LanguageScreen() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>("en");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSave = () => {
      if (selectedLanguage === "fr-CA") {
        setErrorMsg("Sorry, this service is currently not available");
        return;
      }

    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <ArrowLeft size={22} color="#15b1c9ff" />
        </Pressable>
        <Text style={styles.headerTitle}>Language</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Choose your language</Text>
        <Text style={styles.sectionSubtitle}>
          Select the language you want to use in the app.
        </Text>

        <Pressable
          style={[
            styles.optionRow,
            selectedLanguage === "en" && styles.optionRowSelected,
          ]}
          onPress={() => setSelectedLanguage("en")}
        >
          <View>
            <Text style={styles.optionTitle}>English</Text>
            <Text style={styles.optionSubtitle}>Default app language</Text>
          </View>

          {selectedLanguage === "en" ? (
            <View style={styles.checkCircle}>
              <Check size={16} color="#fff" strokeWidth={3} />
            </View>
          ) : (
            <View style={styles.emptyCircle} />
          )}
        </Pressable>

        <Pressable
          style={[
            styles.optionRow,
            selectedLanguage === "fr-CA" && styles.optionRowSelected,
          ]}
          onPress={() => {
              setSelectedLanguage("fr-CA");
              setErrorMsg("");
              }}
        >
          <View>
            <Text style={styles.optionTitle}>Français</Text>
            <Text style={styles.optionSubtitle}>French</Text>
          </View>

          {selectedLanguage === "fr-CA" ? (
            <View style={styles.checkCircle}>
              <Check size={16} color="#fff" strokeWidth={3} />
            </View>
          ) : (
            <View style={styles.emptyCircle} />
          )}
        </Pressable>
         {errorMsg ? (
             <Text style={styles.errorText}>{errorMsg}</Text>) : null}
      </View>

      {/* Save Button */}
      <Pressable
        onPress={handleSave}
        style={({ pressed }) => [
          styles.saveButton,
          pressed && styles.saveButtonPressed,
        ]}
      >
        <Text style={styles.saveButtonText}>Save Language</Text>
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

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },

  sectionSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 16,
    lineHeight: 18,
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    marginBottom: 12,
  },

  optionRowSelected: {
    borderColor: "#15b1c9ff",
    backgroundColor: "#ecfeff",
  },

  optionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },

  optionSubtitle: {
    fontSize: 13,
    color: "#6b7280",
  },

  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#15b1c9ff",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#cbd5e1",
    backgroundColor: "#fff",
  },

  saveButton: {
    backgroundColor: "#15b1c9ff",
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  saveButtonPressed: {
    transform: [{ scale: 0.97 }],
  },

  saveButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 13,
    marginBottom: 12,
  },
});