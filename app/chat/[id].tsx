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

// old history per conversation id
const seededHistories: Record<string, ChatMessage[]> = {
  "1": [
    {
      id: "1",
      from: "me",
      text: "Hey Tom, are you still okay to help with the move?",
      time: new Date(Date.now() - 1000 * 60 * 90),
    },
    {
      id: "2",
      from: "them",
      text: "Yep! Just let me know what time works best.",
      time: new Date(Date.now() - 1000 * 60 * 80),
    },
    {
      id: "3",
      from: "me",
      text: "Morning is best for me, like around 10?",
      time: new Date(Date.now() - 1000 * 60 * 70),
    },
    {
      id: "4",
      from: "them",
      text: "Sounds good, I’ll be there at 10 then.",
      time: new Date(Date.now() - 1000 * 60 * 60),
    }
  ],
  "2": [
    {
      id: "1",
      from: "them",
      text: "Hey Daniel, did you get home okay?",
      time: new Date(Date.now() - 1000 * 60 * 400),
    },
    {
      id: "2",
      from: "me",
      text: "Yep, all good! Thanks again for the ride 🙂",
      time: new Date(Date.now() - 1000 * 60 * 380),
    },
    {
      id: "3",
      from: "them",
      text: "No worries! I grabbed the groceries on the way too.",
      time: new Date(Date.now() - 1000 * 60 * 360),
    },
    {
      id: "4",
      from: "me",
      text: "You’re the best, really appreciate it.",
      time: new Date(Date.now() - 1000 * 60 * 350),
    },
    {
      id: "5",
      from: "them",
      text: "Thanks again for helping with the groceries!",
      time: new Date(Date.now() - 1000 * 60 * 300), // matches lastMessage
    },
  ],
  "3": [
    {
      id: "1",
      from: "me",
      text: "Hey Mike, how’s the pup doing?",
      time: new Date(Date.now() - 1000 * 60 * 1440 * 2), // ~2 days ago
    },
    {
      id: "2",
      from: "them",
      text: "He’s good! A bit restless lately though.",
      time: new Date(Date.now() - 1000 * 60 * 1440 * 2 + 1000 * 60 * 30),
    },
    {
      id: "3",
      from: "me",
      text: "If you want, I can take him for a longer walk this week.",
      time: new Date(Date.now() - 1000 * 60 * 1440 * 2 + 1000 * 60 * 60),
    },
    {
      id: "4",
      from: "them",
      text: "That would be awesome, thank you!",
      time: new Date(Date.now() - 1000 * 60 * 1440 + 1000 * 60 * 30),
    }
  ],
  "4": [
    {
      id: "1",
      from: "me",
      text: "Hi Sarah! Hey! Just checking if you have all the parts for the furniture assembly favour request. I’m open to help, but I want to be sure before accepting. I’ve had past experience where I showed up and the parts were totally missing.",
      time: new Date(Date.now() - 1000 * 60 * 60 * 60),
    },
    {
      id: "2",
      from: "them",
      text: "Oh wow, thanks for checking. It’s an IKEA dining table kit. The replacement bolts are arriving today, but the tabletop box is here and unopened.",
      time: new Date(Date.now() - 1000 * 60 * 60 * 58),
    },
    {
      id: "3",
      from: "me",
      text: "Got it — so tabletop, legs, and hardware (except bolts) are physically with you right now? And you’ll have bolts in hand before we confirm?",
      time: new Date(Date.now() - 1000 * 60 * 60 * 55),
    },
    {
      id: "4",
      from: "them",
      text: "Yes, I’ll have all bolts by 2pm. Everything else is in the room. I can send a photo if you want.",
      time: new Date(Date.now() - 1000 * 60 * 60 * 50),
    },
    {
      id: "5",
      from: "me",
      text: "No need unless something looks off later. If bolts arrive as planned, I can tentatively take requests for Saturday afternoon and adjust last-minute if needed.",
      time: new Date(Date.now() - 1000 * 60 * 60 * 48),
    },
    {
      id: "6",
      from: "them",
      text: "That works, thank you. I’ll confirm once bolts land!",
      time: new Date(Date.now() - 1000 * 60 * 60 * 48),
    },
  ],
};

// in-memory store: id → messages (kept as-is)
const chatStore: Record<string, ChatMessage[]> = {};

export default function ChatScreen() {
  const router = useRouter();
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
  const { conversations, updateConversationLastMessage } = useMessages();

  const conversationId = id;
  const displayName = name ?? "User";

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (!conversationId) return [];

    // already have messages in memory
    if (chatStore[conversationId]) {
      return chatStore[conversationId];
    }

    // use seeded history
    if (seededHistories[conversationId]) {
      const history = seededHistories[conversationId].map((m) => ({ ...m }));
      chatStore[conversationId] = history;
      return history;
    }

    // seed from Messages list snippet
    const conv = conversations.find((c) => c.id === conversationId);
    if (conv) {
      const seed: ChatMessage = {
        id: `seed-${conversationId}`,
        from: "them",
        text: conv.lastMessage,
        time: conv.timestamp,
      };
      chatStore[conversationId] = [seed];
      return chatStore[conversationId];
    }

    // nothing known yet
    chatStore[conversationId] = [];
    return [];
  });

  const [input, setInput] = useState("");

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || !conversationId) return;

    const now = new Date();
    const newMsg: ChatMessage = {
      id: String(now.getTime()),
      from: "me",
      text: trimmed,
      time: now,
    };

    setMessages((prev) => {
      const updated = [...prev, newMsg];
      chatStore[conversationId] = updated; // persist in memory
      return updated;
    });

    // keep Messages page snippet + time in sync
    updateConversationLastMessage(conversationId, trimmed, now);

    setInput("");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f8fafc" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable hitSlop={20} onPress={() => router.back()}>
          <ChevronLeft size={28} color="#11181c" />
        </Pressable>
        <Text style={styles.headerTitle}>Conversation with {displayName}</Text>
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
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#11181c",
  },
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
    paddingVertical: 24,
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
