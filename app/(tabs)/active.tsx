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
import { useEffect, useState } from 'react';

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
function OpenTab(){

    const [favours, setFavours] = useState<Favour[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        getOpenFavoursByUser(MOCK_USER_ID)
            .then(setFavours)
            .catch(() => setError("Failed to load open favours."))
            .finally(() => setLoading(false));

    }, []);

    if (loading){
        return (
        <View style={styles.centered}>
            <ActivityIndicator size="large" color="#15b1c9" />
        </View>
        );
    }

    if (error){
        return <EmptyState message={error} />;
    }

    if (favours.length === 0){
        return <EmptyState message="You have no open favour requests." />;
    }

    return (

        <FlatList
            data={favours}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <FavourCard favour={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
        />

    );
}

// in progress tab
function InProgressTab(){

    const [asRequester, setAsRequester] = useState<Favour[]>([]);
    const [asHelper, setAsHelper] = useState<Favour[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [roleTab, setRoleTab] = useState<"requester" | "helper">("requester");

    useEffect(() => {

        Promise.all([
            getInProgressFavoursAsRequester(MOCK_USER_ID),
            getInProgressFavoursAsHelper(MOCK_USER_ID)
        ])
            .then(([requesterData, helperData]) => {
                setAsRequester(requesterData);
                setAsHelper(helperData);
            })
            .catch(() => setError("Failed to load in-progress favours."))
            .finally(() => setLoading(false));

    }, []);

    if (loading) {
        return (
        <View style={styles.centered}>
            <ActivityIndicator size="large" color="#15b1c9" />
        </View>
        );
    }

    if (error){
        return <EmptyState message={error} />;
    }

    const activeFavours = roleTab === "requester" ? asRequester : asHelper;

    return (

        <View style={styles.inProgressContainer}>
            
            {/* Role switcher */}
            <View style={styles.roleSwitcher}>
                <Pressable
                    style={[
                        styles.roleSwitcherBtn,
                        roleTab === "requester" && styles.roleSwitcherBtnActive,
                    ]}
                    onPress={() => setRoleTab("requester")}
                    >
                    <Text
                        style={[
                        styles.roleSwitcherText,
                        roleTab === "requester" && styles.roleSwitcherTextActive,
                        ]}
                    >As Requester
                    </Text>
                </Pressable>
                <Pressable
                    style={[
                        styles.roleSwitcherBtn,
                        roleTab === "helper" && styles.roleSwitcherBtnActive,
                    ]}
                    onPress={() => setRoleTab("helper")}
                    >
                    <Text
                        style={[
                        styles.roleSwitcherText,
                        roleTab === "helper" && styles.roleSwitcherTextActive,
                        ]}
                    >As Helper
                    </Text>
                </Pressable>
            </View>
    
            {activeFavours.length === 0 ? (
                <EmptyState
                    message={
                        roleTab === "requester"
                        ? "No in-progress favours as requester."
                        : "No in-progress favours as helper."
                    }
                />
            ) : (
                <FlatList
                    data={activeFavours}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <FavourCard favour={item} />}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}

        </View>
    );
}

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