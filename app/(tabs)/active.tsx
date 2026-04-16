import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
    FlatList,
    Pressable,
    ScrollView
} from 'react-native';
import { Clock } from 'lucide-react-native';
import { Image as ExpoImage } from 'expo-image';

import {
    Favour,
    getOpenFavoursByUser,
    getInProgressFavoursAsRequester,
    getInProgressFavoursAsHelper
} from "../../services/favour";

const MOCK_USER_ID = "33333333-3333-3333-3333-333333333333";

const {width: SCREEN_WIDTH} = Dimensions.get("window");

// favour card
function FavourCard({favour}: {favour: Favour}) {

    const postedDate = new Date(favour.posted_at);
    const now = new Date();
    const diffMs = now.getTime() - postedDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    const timeLabel = 
        diffDays > 0
            ? `Posted ${diffDays} days ago`
            : diffHours > 0
            ? `Posted ${diffHours} hours ago`
            : "Posted just now";

    return (

        <View style={styles.card}>
            <ExpoImage
                source={require("../../assets/icon.png")}
                contentFit="cover"
                style={styles.cardImage}
            />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                {favour.title}
                </Text>
                <Text style={styles.cardDescription} numberOfLines={2}>
                {favour.description}
                </Text>
                <View style={styles.cardFooter}>
                <Clock size={14} color="#15b1c9" />
                <Text style={styles.cardTime}>{timeLabel}</Text>
                </View>
            </View>
        </View>
    );
}

// empty state
function EmptyState({message}: {message: string}) {

    return (
        <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>{message}</Text>
        </View>
    );
}

// open tab


// in progress tab


// main screen






export default function ActiveFavoursScreen() {
    

}

const styles = StyleSheet.create({

    // favour card
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 12,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    cardImage: {
        width: 90,
        height: 90,
    },
    cardContent: {
        flex: 1,
        padding: 12,
        justifyContent: "space-between",
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#15b1c9",
    },
    cardDescription: {
        fontSize: 13,
        color: "#4b5563",
        lineHeight: 18,
        marginTop: 2,
    },
    cardFooter: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: 6,
    },
    cardTime: {
        fontSize: 12,
        color: "#15b1c9",
        fontWeight: "500",
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 60,
        paddingHorizontal: 32,
    },
    emptyStateText: {
        fontSize: 14,
        color: "#9ca3af",
        textAlign: "center",
    }



})