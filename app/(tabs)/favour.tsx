import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from '@react-native-picker/picker';
import * as ExpoLocation from 'expo-location';
import { Calendar, ChevronLeft, MapPin, Search, X } from "lucide-react-native";
import { useRef, useState } from "react";
import { createFavour } from "../../services/favour";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
interface LocationType {
  latitude: number;
  longitude: number;
  address?: string;
}

export default function PostFavourScreen() {
    const user = { id: "33333333-3333-3333-3333-333333333333" }; // Mock user for demonstration purposes - useAuth() in later development
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Errands");
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [creditReward, setCreditReward] = useState("0");
    const [useMyLocation, setUseMyLocation] = useState(false);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showMapModal, setShowMapModal] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [mapRegion, setMapRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [MapView, setMapView] = useState<any>(null);
    const [Marker, setMarker] = useState<any>(null);
    const [PROVIDER_GOOGLE, setPROVIDER_GOOGLE] = useState<any>(null);
    const [mapsLoaded, setMapsLoaded] = useState(false);
    const mapRef = useRef<any>(null);

    // Load react-native-maps only when map modal is opened
    const loadMapsModule = () => {
        if (mapsLoaded || MapView) return; // Already loaded
        
        try {
            const maps = require("react-native-maps");
            
            if (maps) {
                const MapComponent = maps?.default || maps;
                const MarkerComponent = maps?.Marker;
                const ProviderGoogle = maps?.PROVIDER_GOOGLE;
                
                if (MapComponent) {
                    setMapView(() => MapComponent);
                }
                if (MarkerComponent) {
                    setMarker(() => MarkerComponent);
                }
                if (ProviderGoogle !== undefined) {
                    setPROVIDER_GOOGLE(ProviderGoogle);
                }
                setMapsLoaded(true);
            }
        } catch (e: any) {
            console.warn("react-native-maps not available:", e?.message || e);
            setMapsLoaded(true); // Mark as attempted to avoid retrying
        }
    };
  
    const categories = ["Errands", "Tutoring", "Cleaning", "Delivery", "Repair", "Moving", "Tech", "Other"];

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    // format address from geocoded data
    const formatAddress = (addressData: ExpoLocation.LocationGeocodedAddress) => {
        const parts = [];
        if(addressData.streetNumber) parts.push(addressData.streetNumber);
        if(addressData.street) parts.push(addressData.street);
        if(addressData.city) parts.push(addressData.city);
        if(addressData.region) parts.push(addressData.region);

        return parts.join(", ") || "Selected Location";
    }

    // get user location (using expo-location)
    const getCurrentLocation = async () => {
        setLoadingLocation(true);
        try {
            // request permission
            const { status } = await ExpoLocation.requestForegroundPermissionsAsync();

            if(status !== "granted"){
              Alert.alert(
                "Location Permission Required",
                "Please enable location permissinos in your device settings to use this feature.",
                [{ text: "OK" }]
              );
              setLoadingLocation(false);
              setUseMyLocation(false);
              return;
            }
        
            // get current location
            const location = await ExpoLocation.getCurrentPositionAsync({
                accuracy: ExpoLocation.Accuracy.High
            });
        
            // get address from coordinates
            const address = await ExpoLocation.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });
        
            const userLocation: LocationType = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                address: address[0] ? formatAddress(address[0]) : undefined        
            };
        
            setSelectedLocation(userLocation);
            setMapRegion({
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        
            setLoadingLocation(false);
            Alert.alert("Success", "Your current location has been set!");
        }catch (error){
            console.error("Error getting location:", error);
            Alert.alert(
                "Error",
                "Unable to get your location. Please try again or select a location on the map.",
                [{ text: "OK" }]
            );
            setLoadingLocation(false);
            setUseMyLocation(false);
        }
    }

    // handle "use my location" toggle
    const handleUseMyLocationToggle = () => {
        // user wants to use their location
        if(!useMyLocation){
            getCurrentLocation();
            setUseMyLocation(true);
        } else {
            // user unchecked the box -- clear the box
            setSelectedLocation(null);
            setUseMyLocation(false);
        }
    }

    // handle map location selection
    const handleMapPress = (event: any) => {
        const coordinates = event.nativeEvent.coordinate;
        setSelectedLocation({
            latitude: coordinates.latitude,
            longitude: coordinates.longitude
        });
    }

    // handle address search
    const handleSearchAddress = async () => {
        if(!searchQuery.trim()){
            Alert.alert("Error", "Please enter an address to search.");
            return;
        }

        Keyboard.dismiss(); // close keyboard
        try{
            const geocoded = await ExpoLocation.geocodeAsync(searchQuery);

            if(geocoded.length > 0){
                const location = geocoded[0];
                const newLocation = {
                    latitude: location.latitude,
                    longitude: location.longitude
                };

                setSelectedLocation(newLocation);

                if (mapRef.current){
                    mapRef.current.animateToRegion({
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }, 1000);
                }
            }else{
                Alert.alert("Not Found", "Could not find the specified address. Please try again.");
            }
        }catch (error){
            console.error("Error geocoding address:", error);
            Alert.alert("Error", "An error occurred while searching for the address. Please try again.");
        }
    }

    // confirm location from map
    const confirmMapLocation = async () => {
        if (selectedLocation){
            // get address for selected location
            try{
                const address = await ExpoLocation.reverseGeocodeAsync({
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude
                });

                setSelectedLocation({
                    ...selectedLocation,
                    address: address[0] ? formatAddress(address[0]) : undefined        
                });
            }catch (error){
                console.log("Could not get address for selected location:", error);
            }

            setUseMyLocation(false);
            setShowMapModal(false);
            Alert.alert("Success", "Location has been set on the map!");
        }else{
            Alert.alert("Error", "Please select a location on the map.");
        }
    }

    // open map modal
    const openMapModal = async () => {
        // Try to load maps module when modal opens
        loadMapsModule();
        
        setShowMapModal(true);

        // if no location set, center map on user location
        if(!selectedLocation){
            try{
                const { status } = await ExpoLocation.requestForegroundPermissionsAsync();

                if (status === "granted"){
                    const location = await ExpoLocation.getCurrentPositionAsync({
                        accuracy: ExpoLocation.Accuracy.Balanced
                    });
                    setMapRegion({
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    });
                }
            }catch (error){
                console.log("Could not get location for map centering:", error);
            }
        }else{
            // center map on selected location
            setMapRegion({
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        }
    }

    const handlePost = async () => {
        if (!user?.id) {
            Alert.alert("Sign In Required", "Please sign in to post a favour.");
            return;
        }

        if (!title.trim()) {
            Alert.alert("Missing Title", "Please enter a title for your favour request.");
            return;
        }

        if (!description.trim()) {
            Alert.alert("Missing Description", "Please enter a description for your favour request.");
            return;
        }

        if (!type) {
            Alert.alert("Missing Type", "Please select a type (Request or Offer) for your favour.");
            return;
        }

        if (!selectedLocation) {
            Alert.alert("Missing Location", "Please set location for your favour request.");
            return;
        }

        setSubmitting(true);

        try {
            const locationString = selectedLocation.address
                ? selectedLocation.address
                : `${selectedLocation.latitude}, ${selectedLocation.longitude}`;

            await createFavour({
                requester_id: user.id,
                category: category,
                title: title.trim(),
                description: description.trim(),
                type: type,
                location: locationString,
                latitude: String(selectedLocation.latitude),
                longitude: String(selectedLocation.longitude),
                status: "posted",
                credit_reward: creditReward.trim() || "0",
            });

            Alert.alert(
                "Success",
                "Your favour request has been posted successfully!",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            setTitle("");
                            setDescription("");
                            setCategory("Errands");
                            setType("");
                            setCreditReward("0");
                            setSelectedLocation(null);
                            setUseMyLocation(false);
                            setDate(new Date());
                        }
                    }
                ]
            );
        } catch (error: any) {
            console.error("Error creating favour:", error);
            Alert.alert(
                "Error",
                error?.message || "Failed to post your favour request. Please try again.",
                [{ text: "OK" }]
            );
        } finally {
            setSubmitting(false);
        }
    }
    
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable hitSlop={20}>
            <ChevronLeft size={28} color="#11181c" />
          </Pressable>
          <Text style={styles.headerTitle}>Create a Favour</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.label}>Favour Title</Text>
          <TextInput
            placeholder="Enter a title for your favour"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            placeholderTextColor="#9ca3af"
          />

          {/* Category */}
          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              dropdownIconColor="#15b1c9ff"
              mode="dropdown"
            >
              {categories.map((cat) => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
            </Picker>
          </View>

          {/* Type */}
          <Text style={styles.label}>Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={type}
              onValueChange={(itemValue) => setType(itemValue)}
              dropdownIconColor="#15b1c9ff"
              mode="dropdown"
            >
              <Picker.Item label="Request" value="request" />
              <Picker.Item label="Offer" value="offer" />
            </Picker>
          </View>

          {/* Description */}
          <Text style={styles.label}>Description</Text>
          <TextInput
            placeholder="Brief description of the help needed including instructions and details"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={[styles.input, styles.textArea]}
            placeholderTextColor="#9ca3af"
          />

          {/* Credit reward */}
          <Text style={styles.label}>Credit reward</Text>
          <TextInput
            placeholder="0"
            value={creditReward}
            onChangeText={setCreditReward}
            keyboardType="numeric"
            style={styles.input}
            placeholderTextColor="#9ca3af"
          />

          {/* Location */}
          <Text style={styles.label}>Location</Text>
          <View style={styles.locationRow}>
            <Pressable
              style={styles.checkboxRow}
              onPress={handleUseMyLocationToggle}
              disabled={loadingLocation}
            >
              <View style={styles.checkbox}>
                {useMyLocation && <View style={styles.checkboxInner} />}
              </View>
              <Text style={styles.checkboxLabel}>Use My Location</Text>
              {loadingLocation && (
                <ActivityIndicator
                  size="small"
                  color="#15b1c9ff"
                  style={{ marginLeft: 8 }}
                />
              )}
            </Pressable>

            <Pressable style={styles.mapButton} onPress={openMapModal}>
              <MapPin size={18} color="#22d3ee" />
              <Text style={styles.mapButtonText}>Set Location on Map</Text>
            </Pressable>
          </View>

          {/* Location Status */}
          { selectedLocation && (
            <View style={styles.locationStatus}>
              <MapPin size={16} color="#10b981" />
              <Text style={styles.locationStatusText}>
                {selectedLocation.address || `${selectedLocation.latitude.toFixed(4)}, ${selectedLocation.longitude.toFixed(4)}`}
              </Text>
            </View>
          )}

          {/* Date */}
          <Text style={styles.label}>Select Date</Text>
          <Pressable
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}
          >
            <Calendar size={20} color="#15b1c9ff" />
            <Text style={styles.dateText}>{formatDate(date)}</Text>
          </Pressable>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === "ios");
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}
        </View>

        {/* Bottom spacer for date select */}
        <View style={{ height: 200 }} />
      </ScrollView>

      {/* Post Button */}
      <View style={styles.footer}>
        <Pressable 
          style={[styles.postButton, submitting && styles.postButtonDisabled]} 
          onPress={handlePost}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.postButtonText}>Post Favour</Text>
          )}
        </Pressable>
      </View>

      {/* Map Modal */}
      <Modal visible={showMapModal} animationType="slide" onRequestClose={() => setShowMapModal(false)}>
        <KeyboardAvoidingView 
          style={styles.modalContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalContainer}>
            
            {/* Modal Header */}
            <View style={styles.mapHeader}>
              <Text style={styles.mapHeaderTitle}>Select Location</Text>
              <Pressable onPress={() => setShowMapModal(false)} hitSlop={20}>
                <X size={24} color="#11181c" />
              </Pressable>
            </View>

            {/* Map Search Bar */}
            <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Search size={20} color="#9ca3af" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for an address..."
                placeholderTextColor="#9ca3af"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearchAddress}
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery("")} hitSlop={10}>
                  <X size={20} color="#9ca3af" />
                </Pressable>
              )}
            </View>
            <Pressable 
              style={styles.searchButton}
              onPress={handleSearchAddress}
            >
              <Text style={styles.searchButtonText}>Search</Text>
            </Pressable>
            </View>

            {/* Map */}
            {MapView ? (
              <MapView
                ref={mapRef}
                {...(PROVIDER_GOOGLE && { provider: PROVIDER_GOOGLE })}
                style={styles.map}
                initialRegion={mapRegion}
                onPress={handleMapPress}
                showsUserLocation
                showsMyLocationButton>

                {selectedLocation && Marker && (
                  <Marker
                    coordinate={{
                      latitude: selectedLocation.latitude,
                      longitude: selectedLocation.longitude
                    }}
                    title="Selected Location"
                  />
                )}
              </MapView>
            ) : (
              <View style={[styles.map, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                <Text style={{ color: '#6b7280', textAlign: 'center', fontSize: 14 }}>
                  Map unavailable.
                </Text>
              </View>
            )}

            {/* Confirm Button */}
            <View style={styles.mapFooter}>
              <Pressable
                style={[
                  styles.confirmButton, 
                  !selectedLocation && styles.confirmButtonDisabled
                ]}
                onPress={confirmMapLocation}
                disabled={!selectedLocation}
              >
                <Text style={styles.confirmButtonText}>Confirm Location</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>         
      </Modal>  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#11181c",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#11181c",
    marginBottom: 8,
    marginTop: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#15b1c9ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxInner: {
    width: 14,
    height: 14,
    borderRadius: 4,
    backgroundColor: "#15b1c9ff",
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#11181c",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ecfeff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  mapButtonText: {
    marginLeft: 8,
    color: "#22d3ee",
    fontWeight: "600",
  },
  locationStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    padding: 12,
    backgroundColor: "#d1fae5",
    borderRadius: 8,
  },
  locationStatusText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#065f46",
    fontWeight: "500",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  dateText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#11181c",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  postButton: {
    backgroundColor: "#15b1c9ff",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  postButtonDisabled: {
    backgroundColor: "#cbd5e1",
    opacity: 0.7,
  },
  postButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mapHeader: {
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
  mapHeaderTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#11181c",
  },
  map: {
    flex: 1,
  },
  mapInstructions: {
    position: "absolute",
    top: 120,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapInstructionsText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  mapFooter: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  confirmButton: {
    backgroundColor: "#15b1c9ff",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  confirmButtonDisabled: {
    backgroundColor: "#cbd5e1",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    gap: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#11181c",
  },
  searchButton: {
    backgroundColor: "#15b1c9ff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    justifyContent: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
