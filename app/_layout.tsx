import { Tabs } from "expo-router";
import { House, Hand, User, MessageCircle } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#15b1c9ff",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          height: 90,
          paddingBottom: 30,
          paddingTop: 10,
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <House size={28} color={color} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="favour"
        options={{
          title: "Favour",
          tabBarIcon: ({ color }) => <Hand size={28} color={color} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={28} color={color} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color }) => <MessageCircle size={28} color={color} strokeWidth={2.5} />,
        }}
      />

      {/* Hidden screens – part of the tab navigator, but no tab button */}
      <Tabs.Screen
        name="report"
        options={{
          href: null,
          
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
          
        }}
      />
      <Tabs.Screen
        name="redeem"
        options={{
          href: null,
          
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          href: null,
          
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
          
        }}
      />

    </Tabs>


  );
}