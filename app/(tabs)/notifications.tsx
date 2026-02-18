import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Bell } from "lucide-react-native"; 


//data
const notifications = [
  {
    id: "1",
    title: "New favour nearby",
    body: "Sarah just posted a grocery pick-up favour 1.2km from you.",
    time: "Just now",
    status: "success",
    unread: true,
  },
  {
    id: "2",
    title: "Your favour was accepted",
    body: "Daniel agreed to help with your \"Dog walking this afternoon\" favour.",
    time: "20 mins ago",
    status: "success",
    unread: true,
  },
  {
    id: "3",
    title: "Favour completed",
    body: "Emily marked your \"Carry boxes upstairs\" favour as completed.",
    time: "1 hour ago",
    status: "success",
    unread: false,
  },
  {
    id: "4",
    title: "You earned 25 kindness points",
    body: "Thanks for helping with \"Assemble IKEA shelf\". Points added to your balance.",
    time: "Yesterday",
    status: "reward",
    unread: true,
  },
  {
    id: "5",
    title: "New message about a favour",
    body: "Robert sent you a question about your \"Pet sitting this weekend\" favour.",
    time: "2 days ago",
    status: "info",
    unread: false,
  },
  {
    id: "6",
    title: "Review received",
    body: "“Super helpful and right on time!” – your rating for the last favour is now 4.9.",
    time: "3 days ago",
    status: "info",
    unread: false,
  },
];

//logic
export default function NotificationsScreen() {
  const router = useRouter();

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
});
