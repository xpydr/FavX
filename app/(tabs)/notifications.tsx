import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Bell } from "lucide-react-native";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  useEffect(() => {
    fetchNotifications();
  }, []);
  const fetchNotifications = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    const formatted = (data || []).map((item) => ({
      id: item.id,
      title: mapTitle(item.type),
      body: item.message,
      time: formatTime(item.created_at),
      unread: !item.is_read,
    }));

    setNotifications(formatted);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <ArrowLeft size={22} color="#15b1c9ff" />
        </Pressable>
        <Text style={styles.headerTitle}>Notifications</Text>
        {/* spacer to balance the arrow */}
        <View style={{ width: 22 }} />
      </View>

      {/* List card */}
      <View style={styles.card}>
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Bell size={28} color="#9ca3af" />
              <Text style={styles.emptyTitle}>No notifications yet</Text>
              <Text style={styles.emptyText}>
                We don’t have any messages for you yet.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              {/* Left: bell + text */}
              <View style={styles.leftGroup}>
                <Bell
                  size={22}
                  style={styles.bellIcon}
                  color={item.unread ? "#15b1c9ff" : "#9ca3af"}
                  strokeWidth={2.2}
                />

                <View style={styles.textGroup}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemBody}>{item.body}</Text>
                </View>
              </View>

              {/* Right: time only */}
              <View style={styles.rightGroup}>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
            </View>
          )}
        />
      </View>
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
    fontSize: 28,
    fontWeight: "800",
    color: "#15b1c9ff",
    textAlign: "center",
    flex: 1,
  },
  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  separator: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginLeft: 44,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
  },
  leftGroup: {
    flexDirection: "row",
    flex: 1,
  },
  bellIcon: {
    marginTop: 4,
    marginRight: 12,
  },
  textGroup: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  itemBody: {
    fontSize: 14,
    color: "#4b5563",
    marginTop: 2,
  },
  rightGroup: {
    alignItems: "flex-end",
    marginLeft: 8,
  },
  timeText: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 12,
    color: "#111827",
  },
  emptyText: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
    textAlign: "center",
  },
});
function mapTitle(type: string) {
  switch (type) {
    case "favour_request":
      return "New favour nearby";
    case "favour_accepted":
      return "Your favour was accepted";
    case "favour_completed":
      return "Favour completed";
    case "review_received":
      return "Review received";
    case "credit_earned":
      return "You earned points";
    case "system_alert":
      return "System alert";
    default:
      return "Notification";
  }
}

function formatTime(date: string) {
  const now = new Date();
  const created = new Date(date);
  const diff = Math.floor((now.getTime() - created.getTime()) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return created.toLocaleDateString();
}
