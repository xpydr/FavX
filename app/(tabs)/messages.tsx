import React, { useState, useMemo } from "react";
import {
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  View,
  TextInput,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ChevronLeft, Search } from "lucide-react-native";

// Mock conversations
const conversations = [
  {
    id: "1",
    name: "Tom Clancy",
    avatar: "https://i.pravatar.cc/300?img=4",
    lastMessage: "Sounds good! I can help tomorrow at 3pm",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    unread: 2,
  },
  {
    id: "2",
    name: "Ashley Chen",
    avatar: "https://i.pravatar.cc/300?img=5",
    lastMessage: "Thanks again for helping with the groceries!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    unread: 0,
  },
  {
    id: "3",
    name: "Mike Torres",
    avatar: "https://i.pravatar.cc/300?img=7",
    lastMessage: "Hey, still need help with the dog walk?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unread: 1,
  },
  {
    id: "4",
    name: "Sarah Kim",
    avatar: "https://i.pravatar.cc/300?img=21",
    lastMessage: "Yes, I’m free this weekend!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    unread: 0,
  },
];

export default function MessagesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const renderItem = ({ item }: { item: (typeof conversations)[0] }) => (
    <Pressable
      style={styles.chatItem}
      onPress={() => {
        if (item.unread > 0) {
          Alert.alert(item.name, `You have ${item.unread} unread messages.`);
        } else {
          Alert.alert(item.name, "No unread messages.");
        }
      }}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.unread > 0 && <View style={styles.onlineDot} />}
      </View>

      <View style={styles.chatInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.from}>{item.name}</Text>
          <Text style={styles.time}>{item.timestamp.toLocaleTimeString()}</Text>
        </View>

        <View style={styles.messageRow}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
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
      {/* Header */}
      <View style={styles.header}>
        <Pressable hitSlop={20} onPress={() => router.back()}>
          <ChevronLeft size={28} color="#11181c" />
        </Pressable>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchBox}>
        <Search size={18} color="#94a3b8" />
        <TextInput
          placeholder="Search conversations..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      {/* Conversations List */}
      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No conversations found.</Text>
          </View>
        }
      />
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
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#11181c",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 10,
    backgroundColor: "#f1f5f9",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: { marginLeft: 8, flex: 1, fontSize: 15, color: "#11181c" },
  chatItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 8,
    marginHorizontal: 16,
    borderRadius: 20,
    elevation: 2,
  },
  avatarContainer: { position: "relative", marginRight: 12 },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  chatInfo: { flex: 1, justifyContent: "center" },
  nameRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  from: { fontSize: 17, fontWeight: "600", color: "#11181c" },
  messageRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  lastMessage: { fontSize: 15, color: "#64748b", flex: 1, marginRight: 12 },
  onlineDot: {
    position: "absolute",
    right: 2,
    bottom: 2,
    width: 14,
    height: 14,
    borderRadius: 8,
    backgroundColor: "#22c55e",
    borderWidth: 2,
    borderColor: "white",
  },
  unreadBadge: {
    backgroundColor: "#15b1c9ff",
    minWidth: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  unreadText: { fontSize: 13, fontWeight: "700", color: "white" },
  list: { paddingTop: 10, paddingBottom: 110 },
  emptyContainer: { alignItems: "center", marginTop: 80 },
  emptyText: { fontSize: 16, color: "#94a3b8", textAlign: "center" },
});
