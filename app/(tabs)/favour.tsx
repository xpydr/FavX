import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from '@react-native-picker/picker';
import * as ExpoLocation from 'expo-location';
import { Calendar, ChevronLeft, MapPin, Search, X } from "lucide-react-native";
import { useRef, useState } from "react";
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
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

interface LocationType {
  latitude: number;
  longitude: number;
  address?: string;
}

export default function PostFavourScreen(){

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Errands");
    const [description, setDescription] = useState("");
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
    const mapRef = useRef<MapView>(null);
  
    const categories = ["Errands", "Tutoring", "Cleaning", "Delivery", "Repair", "Other"];

}
