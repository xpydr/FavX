import React, { useState, useMemo } from "react";
import {
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  View,
  TextInput,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ChevronLeft, Search } from "lucide-react-native";
import { useMessages } from "../context/MessagesContext"; // ../ from (tabs)

export default function MessagesScreen() {
  const router = useRouter();
  const { conversations } = useMessages();
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q)
    );
  }, [searchQuery, conversations]);

  const renderItem = ({ item }: { item: (typeof conversations)[0] }) => (
    <Pressable
      style={styles.chat}
      onPress={() =>
        router.push({
          pathname: "/chat/[id]",
          params: { id: item.id, name: item.name },
        })
      }
    >
      <View style={styles.avatarWrap}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.unread > 0 && <View style={styles.dot} />}
      </View>

      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>
            {item.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.preview} numberOfLines={1}>
            {item.lastMessage}
          </Text>
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
        <Text style={styles.title}>Messages</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Search */}
      <View className="search" style={styles.search}>
        <Search size={18} color="#94a3b8" />
        <TextInput
          placeholder="Search conversations..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.empty}>No chats found</Text>
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
  title: { fontSize: 22, fontWeight: "800", color: "#11181c" },
  search: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    backgroundColor: "#f1f5f9",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: { marginLeft: 8, flex: 1, fontSize: 15, color: "#11181c" },
  list: { paddingTop: 10, paddingBottom: 100 },
  chat: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 20,
    elevation: 2,
  },
  avatarWrap: { position: "relative", marginRight: 12 },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  dot: {
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
  info: { flex: 1, justifyContent: "center" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: { fontSize: 17, fontWeight: "600", color: "#11181c" },
  time: { fontSize: 13, color: "#94a3b8" },
  preview: { fontSize: 15, color: "#64748b", flex: 1, marginRight: 8 },
  emptyWrap: { marginTop: 80, alignItems: "center", paddingHorizontal: 40 },
  empty: { fontSize: 16, color: "#94a3b8", textAlign: "center" },
});
