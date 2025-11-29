import React from "react";
import { Text, FlatList, Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { formatDistanceToNow } from "date-fns";

// Mock conversations
const conversations = [
  {
    id: "1",
    name: "Tom Clancy",
    avatar: "https://i.pravatar.cc/300?img=4",
    lastMessage: "Sounds good! I can help tomorrow at 3pm",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    unread: 2,
  },
  {
    id: "2",
    name: "Ashley Chen",
    avatar: "https://i.pravatar.cc/300?img=5",
    lastMessage: "Thanks again for helping with the groceries!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    unread: 0,
  },
  {
    id: "3",
    name: "Mike Torres",
    avatar: "https://i.pravatar.cc/300?img=7",
    lastMessage: "Hey, still need help with the dog walk?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unread: 1,
  },
  {
    id: "4",
    name: "Sarah Kim",
    avatar: "https://i.pravatar.cc/300?img=21",
    lastMessage: "Yes I’m free this weekend!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    unread: 0,
  },
];

export default function MessagesScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: typeof conversations[0] }) => (
      <Pressable style={styles.chatItem} onPress={() => router.push(`/chat/${item.id}`)}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          {item.unread > 0 && <View style={styles.onlineDot} />}
        </View>

        <View style={styles.chatInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.timestamp}>{formatDistanceToNow(item.timestamp, { addSuffix: true })}</Text>
          </View>

          <View style={styles.messageRow}>
            <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
            {item.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unread}</Text>
                </View>
            )}
          </View>
        </View>
      </Pressable>
  );

  return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.title}>Messages</Text>
          </Pressable>
        </View>

        <FlatList
            data={conversations}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  title: { fontSize: 32, fontWeight: "800", color: "#11181c", paddingTop: 8, includeFontPadding: false, textAlignVertical: "center" },
  list: { paddingTop: 12, paddingBottom: 100 },
  chatItem: { flexDirection: "row", paddingHorizontal: 20, paddingVertical: 14, backgroundColor: "#fff", marginBottom: 8, marginHorizontal: 16, borderRadius: 20, elevation: 2 },
  avatarContainer: { position: "relative" },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  onlineDot: { position: "absolute", right: 2, bottom: 2, width: 16, height: 16, borderRadius: 8, backgroundColor: "#22c55e", borderWidth: 3, borderColor: "#fff" },
  chatInfo: { flex: 1, marginLeft: 16, justifyContent: "center" },
  nameRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  name: { fontSize: 17, fontWeight: "600", color: "#11181c" },
  timestamp: { fontSize: 13, color: "#94a3b8" },
  messageRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  lastMessage: { fontSize: 15, color: "#64748b", flex: 1, marginRight: 12 },
  unreadBadge: { backgroundColor: "#22d3ee", minWidth: 24, height: 24, borderRadius: 12, justifyContent: "center", alignItems: "center", paddingHorizontal: 8 },
  unreadText: { color: "#fff", fontSize: 13, fontWeight: "700" },
});
