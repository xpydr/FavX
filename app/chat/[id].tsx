import React from "react";
import { Text, Pressable, StyleSheet, View, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { formatDistanceToNow } from "date-fns";

const mockMessages = [
  {
    id: "1",
    from: "them",
    text: "Hey, I saw your profile. How experienced are you with mobile app features like maps and sensor use?",
    time: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
  },
  {
    id: "2",
    from: "me",
    text: "Hey! I’m still a beginner, but I already integrated map routing and local storage using FavX’s Expo structure.",
    time: new Date(Date.now() - 1000 * 60 * 25),
  },
  {
    id: "3",
    from: "them",
    text: "Cool. Are you good at explaining things step by step?",
    time: new Date(Date.now() - 1000 * 60 * 20),
  },
  {
    id: "4",
    from: "me",
    text: "Yes! I break features into small steps and test them carefully to fit mobile device limits.",
    time: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: "5",
    from: "them",
    text: "Nice. Let’s try building more features this weekend.",
    time: new Date(Date.now() - 1000 * 60 * 10),
  },
  {
    id: "6",
    from: "me",
    text: "Sounds good!",
    time: new Date(Date.now() - 1000 * 60 * 9),
  },
  {
    id: "7",
    from: "them",
    text: "Thanks!",
    time: new Date(Date.now() - 1000 * 60 * 5),
  },
];

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const name = String(params.name ?? "User");

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <Pressable hitSlop={20} onPress={() => router.back()}>
          <ChevronLeft size={28} color="#11181c" />
        </Pressable>
        <Text style={styles.headerTitle}>Conversation with {name}</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Message bubbles */}
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {mockMessages.map((m) => {
          const isMe = m.from === "me";
          return (
            <View
              key={m.id}
              style={[
                styles.bubble,
                isMe ? styles.bubbleMe : styles.bubbleThem,
              ]}
            >
              {/* Tail */}
              {!isMe && <View style={styles.tailThem} />}
              {isMe && <View style={styles.tailMe} />}

              <Text style={styles.bubbleText}>{m.text}</Text>

              {/* Sent time */}
              <Text style={styles.bubbleTime}>
                Sent {formatDistanceToNow(m.time, { addSuffix: true })}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#11181c" },
  list: { flex: 1, paddingTop: 12, paddingBottom: 100 },

  bubble: {
    padding: 14,
    maxWidth: "75%",
    marginBottom: 10,
    elevation: 2,
    position: "relative",
  },
  bubbleThem: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    marginHorizontal: 16, // side padding
  },
  bubbleMe: {
    alignSelf: "flex-end",
    backgroundColor: "#dcfce7",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 2,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    marginHorizontal: 16,
  },

  tailThem: {
    position: "absolute",
    left: -6,
    bottom: 0,
    width: 12,
    height: 12,
    backgroundColor: "#fff",
    borderBottomRightRadius: 10,
    transform: [{ rotate: "45deg" }],
  },
  tailMe: {
    position: "absolute",
    right: -6,
    bottom: 0,
    width: 12,
    height: 12,
    backgroundColor: "#dcfce7",
    borderBottomLeftRadius: 10,
    transform: [{ rotate: "-45deg" }],
  },

  bubbleText: {
    fontSize: 16,
    color: "#11181c",
  },
  bubbleTime: {
    fontSize: 12,
    color: "#475569",
    marginTop: 6,
    fontWeight: "600",
  },
});

