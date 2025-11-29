import { useState } from "react";
import {
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Platform,
  Alert,
} from "react-native";
import { ChevronLeft, MapPin, Calendar } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { Picker } from '@react-native-picker/picker';

export default function PostFavourScreen() {

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Errands");
  const [description, setDescription] = useState("");
  const [useMyLocation, setUseMyLocation] = useState(true);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const categories = ["Errands", "Tutoring", "Cleaning", "Delivery", "Repair", "Other"];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handlePost = () => {
      // TODO: Send to backend / show success
      return;
    }
    
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable hitSlop={20}>
            <ChevronLeft size={28} color="#11181c" />
          </Pressable>
          <Text style={styles.headerTitle}>Create a Favour</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.label}>Favour Title</Text>
          <TextInput
            placeholder="What do you need?"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            placeholderTextColor="#9ca3af"
          />

          {/* Category */}
          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              dropdownIconColor="#15b1c9ff"
              mode="dropdown"
            >
              {categories.map((cat) => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
            </Picker>
          </View>

          {/* Description */}
          <Text style={styles.label}>Description</Text>
          <TextInput
            placeholder="Brief description of the help needed including instructions and details"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={[styles.input, styles.textArea]}
            placeholderTextColor="#9ca3af"
          />

          {/* Location */}
          <Text style={styles.label}>Location</Text>
          <View style={styles.locationRow}>
            <Pressable
              style={styles.checkboxRow}
              onPress={() => setUseMyLocation(!useMyLocation)}
            >
              <View style={styles.checkbox}>
                {useMyLocation && <View style={styles.checkboxInner} />}
              </View>
              <Text style={styles.checkboxLabel}>Use my location</Text>
            </Pressable>

            <Pressable style={styles.mapButton}>
              <MapPin size={18} color="#22d3ee" />
              <Text style={styles.mapButtonText}>Set Location on Map</Text>
            </Pressable>
          </View>

          {/* Date */}
          <Text style={styles.label}>Select Date</Text>
          <Pressable
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}
          >
            <Calendar size={20} color="#15b1c9ff" />
            <Text style={styles.dateText}>{formatDate(date)}</Text>
          </Pressable>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === "ios");
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}
        </View>

        {/* Bottom spacer for date select */}
        <View style={{ height: 200 }} />
      </ScrollView>

      {/* Post Button */}
      <View style={styles.footer}>
        <Pressable style={styles.postButton} onPress={handlePost}>
          <Text style={styles.postButtonText}>Post Favour</Text>
        </Pressable>
      </View>
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
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#11181c",
    marginBottom: 8,
    marginTop: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },
  picker: {
    height: 100,
    color: "#11181c",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#15b1c9ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxInner: {
    width: 14,
    height: 14,
    borderRadius: 4,
    backgroundColor: "#15b1c9ff",
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#11181c",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ecfeff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  mapButtonText: {
    marginLeft: 8,
    color: "#22d3ee",
    fontWeight: "600",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  dateText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#11181c",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  postButton: {
    backgroundColor: "#15b1c9ff",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  postButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});