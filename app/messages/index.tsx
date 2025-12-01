import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { formatDistanceToNow } from "date-fns";
import { useMessages } from "../context/MessagesContext";

export default function MessagesScreen() {
  const router = useRouter();
  const { conversations } = useMessages();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>

      <FlatList
        data={conversations.sort(
          (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
        )}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() =>
              router.push({
                pathname: "/chat/[id]",
                params: { id: item.id, name: item.name },
              })
            }
          >
            <View style={styles.rowText}>
              <Text style={styles.name}>{item.name}</Text>
              <Text numberOfLines={1} style={styles.snippet}>
                {item.lastMessage}
              </Text>
            </View>
            <Text style={styles.time}>
              {formatDistanceToNow(item.timestamp, { addSuffix: true })}
            </Text>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 20,
    color: "#0f172a",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  rowText: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 2,
  },
  snippet: {
    fontSize: 14,
    color: "#64748b",
  },
  time: {
    fontSize: 12,
    color: "#94a3b8",
  },
  separator: {
    height: 1,
    backgroundColor: "#e2e8f0",
  },
});
