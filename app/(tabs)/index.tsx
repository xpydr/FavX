
import { useState, useMemo } from "react";
import {
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Image as ExpoImage } from "expo-image";

import {
  Menu,
  Search,
  MapPin,
  Clock
} from "lucide-react-native";

// Mock data
const favours = [
  {
    id: "1",
    title: "Dog Walking Needed",
    description: "Looking for someone to walk my golden retriever this afternoon",
    distance: "2km",
    date: "Today",
    image: "https://images.unsplash.com/photo-1591160690555-5debfba289f0?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Errands",
  },
  {
    id: "2",
    title: "Grocery Shopping Help",
    description: "Need help carrying bags from the market",
    distance: "1.5km",
    date: "Tomorrow",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Errands",
  },
  {
    id: "3",
    title: "Math Tutoring",
    description: "High-school algebra help for my daughter",
    distance: "3km",
    date: "This week",
    image: "https://images.unsplash.com/photo-1635372722656-389f87a941b7?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Tutoring",
  },
  {
    id: "4",
    title: "Furniture Assembly",
    description: "IKEA desk needs assembly this weekend",
    distance: "2.8km",
    date: "Saturday",
    image: "https://images.unsplash.com/photo-1674065719169-5ba77e617e60?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Errands",
  },
];

const filters = ["All", "Errands", "Tutoring"];

export default function HomeScreen() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

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
      {/* Header + Filters + Search */}
      <View style={styles.headerContainer}>
        <View style={styles.topBar}>
          <Pressable hitSlop={20}>
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
});
