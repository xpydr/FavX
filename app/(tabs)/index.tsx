import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "expo-router";

import {
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Animated,
  Dimensions,
} from "react-native";
import { Image as ExpoImage } from "expo-image";

import {
  Menu,
  Search,
  MapPin,
  Clock,
  Home,
  Bell,
  Crown,
  Star,
  Info,
  Settings as SettingsIcon,
  Power,
  Moon,
} from "lucide-react-native";

// Mock data
const favours = [
  {
    id: "1",
    title: "Dog Walking Needed",
    description:
      "Looking for someone to walk my golden retriever this afternoon",
    distance: "2km",
    date: "Today",
    image:
      "https://images.unsplash.com/photo-1591160690555-5debfba289f0?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Errands",
  },
  {
    id: "2",
    title: "Grocery Shopping Help",
    description: "Need help carrying bags from the market",
    distance: "1.5km",
    date: "Tomorrow",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Errands",
  },
  {
    id: "3",
    title: "Math Tutoring",
    description: "High-school algebra help for my daughter",
    distance: "3km",
    date: "This week",
    image:
      "https://images.unsplash.com/photo-1635372722656-389f87a941b7?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Tutoring",
  },
  {
    id: "4",
    title: "Furniture Assembly",
    description: "IKEA desk needs assembly this weekend",
    distance: "2.8km",
    date: "Saturday",
    image:
      "https://images.unsplash.com/photo-1674065719169-5ba77e617e60?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Errands",
  },
];

const filters = ["All", "Errands", "Tutoring"];

export default function HomeScreen() {
  const router = useRouter();   
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");


  const drawerWidth = useMemo(
    () => Dimensions.get("window").width * 0.75,
    []
  );

  // 0 = closed, 1 = open
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isMenuOpen ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isMenuOpen, slideAnim]);

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-drawerWidth, 0],
  });

  const primaryMenuItems = [
    { key: "Dashboard", label: "Dashboard", icon: Home },
    { key: "Notifications", label: "Notifications", icon: Bell },
    { key: "Leaderoard", label: "Leaderboard", icon: Crown},
    { key: "Redeem", label: "Redeem", icon: Star },
  ];

  const secondaryMenuItems = [
    { key: "Report", label: "Report", icon: Info },
    { key: "Settings", label: "Settings", icon: SettingsIcon },
    { key: "Logout", label: "Log out", icon: Power },
  ];

  const filteredFavours = useMemo(() => {
    let result = favours;

    if (selectedFilter !== "All") {
      result = result.filter((item) => item.category === selectedFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }

    return result;
  }, [selectedFilter, searchQuery]);

  return (
    <View style={styles.container}>
      {/* MAIN CONTENT */}
      <View style={{ flex: 1 }}>
        {/* Header + Filters + Search */}
        <View style={styles.headerContainer}>
          <View style={styles.topBar}>
            <Pressable hitSlop={20} onPress={() => setIsMenuOpen(true)}>
              <Menu size={28} color="#15b1c9ff" />
            </Pressable>
            <Text style={styles.logo}>FavX</Text>
            <View style={{ width: 28 }} />
          </View>

          {/* Filter Tabs */}
          <View style={styles.filterContainer}>
            {filters.map((filter) => (
              <Pressable
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                style={[
                  styles.filterButton,
                  selectedFilter === filter && styles.filterButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedFilter === filter && styles.filterTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Search size={20} color="#9ca3af" />
            <TextInput
              placeholder="Search..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>

        {/* Favours List */}
        <FlatList
          data={filteredFavours}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No favours found for the selected filter and search.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable style={styles.cardPressable}>
              <View style={styles.card}>
                <ExpoImage
                  source={{ uri: item.image }}
                  style={styles.cardImage}
                  contentFit="cover"
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDescription}>
                    {item.description}
                  </Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.cardFooterText}>
                      <MapPin size={20} color="#15b1c9ff" /> {item.distance}
                    </Text>
                    <Text style={styles.cardFooterText}>
                      <Clock size={20} color="#15b1c9ff" /> {item.date}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          )}
        />
      </View>

      {/* TAP AREA ON THE RIGHT TO CLOSE */}
      {isMenuOpen && (
        <Pressable
          style={styles.backdrop}
          onPress={() => setIsMenuOpen(false)}
        />
      )}

      {/* SLIDING DRAWER */}
      <Animated.View
        style={[
          styles.drawer,
          { width: drawerWidth, transform: [{ translateX }] },
        ]}
      >
        {/* TOP SECTION: LOGO + MOON + MAIN ITEMS */}
        <View style={styles.drawerTopSection}>
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerLogo}>FavX</Text>
            <Pressable onPress={() => {}}>
              <View style={styles.moonButton}>
                <Moon size={18} color="#15b1c9ff" />
              </View>
            </Pressable>
          </View>

          <View style={styles.drawerPrimaryList}>
            {primaryMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.key;

              return (
                <Pressable
                  key={item.key}
                  onPress={() => {
                    setActiveItem(item.key);
                    setIsMenuOpen(false);

                    if (item.key === "Notifications") {
                      router.push("/notifications");   
                    }
                  
                    else if (item.key === "Redeem") {
                      router.push("/redeem");
                    }

                    else if (item.key === "Leaderoard") {
                      router.push("/leaderboard");
                    }

                  }
                }
                  style={[
                    styles.drawerItemRow,
                    isActive && styles.drawerItemRowActive,
                  ]}
                >
                  <View
                    style={[
                      styles.drawerIconWrapper,
                      isActive && styles.drawerIconWrapperActive,
                    ]}
                  >
                    <Icon
                      size={18}
                      color={isActive ? "#15b1c9ff" : "#4b5563"}
                    />
                  </View>
                  <Text
                    style={[
                      styles.drawerItemLabel,
                      isActive && styles.drawerItemLabelActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* BOTTOM SECTION: REPORT / SETTINGS / LOG OUT */}
        <View style={styles.drawerBottomSection}>
          {secondaryMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Pressable
                key={item.key}
                onPress={() => {
                  setActiveItem(item.key);
                  setIsMenuOpen(false);

                  if (item.key === "Report") {
                    router.push("/report");  
                  
                  } 
                  
                  else if (item.key === "Settings") {
                    router.push("/settings");
                  }
                }}

                style={styles.drawerBottomItem}
              >
                <Icon size={18} color="#4b5563" />
                <Text style={styles.drawerBottomLabel}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  headerContainer: {
    backgroundColor: "#fff",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  logo: {
    fontSize: 32,
    fontWeight: "800",
    color: "#15b1c9ff",
    paddingTop: 8,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginTop: 24,
  },
  filterButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#e5e7eb",
  },
  filterButtonActive: {
    backgroundColor: "#15b1c9ff",
  },
  filterText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },
  filterTextActive: {
    color: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 24,
    marginTop: 16,
    backgroundColor: "#f3f4f6",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    marginLeft: 12,
    flex: 1,
    fontSize: 16,
    color: "#11181c",
  },
  listContent: {
    paddingBottom: 20,
  },
  cardPressable: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardImage: {
    width: 128,
    height: 128,
    resizeMode: "cover",
    backgroundColor: "transparent",
    display: "flex",
    flex: 0,
  },
  cardContent: {
    flex: 1,
    padding: 8,
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#11181c",
  },
  cardDescription: {
    fontSize: 14,
    color: "#4b5563",
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  cardFooterText: {
    fontSize: 12,
    color: "#6b7280",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    marginTop: 80,
  },
  emptyText: {
    fontSize: 17,
    color: "#6b7280",
    textAlign: "center",
  },

  // Drawer + backdrop
  backdrop: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent", // keep underlying screen visible like Figma
  },
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#e5e7eb",
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 24,
    justifyContent: "space-between",
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  drawerTopSection: {},
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  drawerLogo: {
    fontSize: 32,
    fontWeight: "800",
    color: "#15b1c9ff",
  },
  moonButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#cbd5f5",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
  },
  drawerPrimaryList: {
    marginTop: 8,
  },
  drawerItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginBottom: 12,
  },
  drawerItemRowActive: {
    backgroundColor: "#bfe7f0",
  },
  drawerIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    marginRight: 12,
  },
  drawerIconWrapperActive: {
    backgroundColor: "#ffffff",
  },
  drawerItemLabel: {
    fontSize: 16,
    color: "#4b5563",
    fontWeight: "500",
  },
  drawerItemLabelActive: {
    color: "#111827",
  },
  drawerBottomSection: {
    gap: 12,
  },
  drawerBottomItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  drawerBottomLabel: {
    marginLeft: 10,
    fontSize: 15,
    color: "#4b5563",
  },
});

