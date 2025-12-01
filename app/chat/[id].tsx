import React, { useState } from "react";
import {
  Text,
  Pressable,
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { formatDistanceToNow } from "date-fns";
import { useMessages } from "../context/MessagesContext";

type ChatMessage = {
  id: string;
  from: "me" | "them";
  text: string;
  time: Date;
};

const initialMockMessages: ChatMessage[] = [
  {
    id: "1",
    from: "them",
    text: "Hey, I saw your profile. How experienced are you with mobile app features like maps and sensor use?",
    time: new Date(Date.now() - 1000 * 60 * 30),
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
];

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string; name?: string }>();
  const { updateConversationLastMessage } = useMessages();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMockMessages);
  const [input, setInput] = useState("");

  const name = params.name ?? "User";
  const conversationId = params.id;

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || !conversationId) return;

    const newMsg: ChatMessage = {
      id: String(Date.now()),
      from: "me",
      text: trimmed,
      time: new Date(),
    };

    setMessages((prev) => [...prev, newMsg]);
    updateConversationLastMessage(conversationId, trimmed); // updates list + order
    setInput("");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f8fafc" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      {/* Custom Header */}
      <View style={styles.header}>
        <Pressable hitSlop={20} onPress={() => router.back()}>
          <ChevronLeft size={28} color="#11181c" />
        </Pressable>
        <Text style={styles.headerTitle}>Conversation with {name}</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Messages */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((m) => {
          const isMe = m.from === "me";
          return (
            <View
              key={m.id}
              style={[
                styles.bubble,
                isMe ? styles.bubbleMe : styles.bubbleThem,
              ]}
            >
              {!isMe && <View style={styles.tailThem} />}
              {isMe && <View style={styles.tailMe} />}

              <Text style={styles.bubbleText}>{m.text}</Text>
              <Text style={styles.bubbleTime}>
                Sent {formatDistanceToNow(m.time, { addSuffix: true })}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      {/* Input bar */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#94a3b8"
          value={input}
          onChangeText={setInput}
        />
        <Pressable style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendText}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
  list: { flex: 1, paddingTop: 12 },

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
    marginHorizontal: 16,
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
  bubbleText: { fontSize: 16, color: "#11181c" },
  bubbleTime: {
    fontSize: 12,
    color: "#475569",
    marginTop: 6,
    fontWeight: "600",
  },

  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  input: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: "#11181c",
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#15b1c9ff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  sendText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
