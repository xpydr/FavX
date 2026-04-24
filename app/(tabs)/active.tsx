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
    getInProgressFavoursAsHelper,
    getClosedFavoursAsHelper,
    getClosedFavoursAsRequester
} from "../../services/favour";
import { useCallback, useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

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

    const { user } = useAuth();
    const [favours, setFavours] = useState<Favour[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        if(!user?.id) return;
        getOpenFavoursByUser(user.id)
            .then(setFavours)
            .catch(() => { setError("Failed to load open favours.");})
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

    const {user} = useAuth();
    const [asRequester, setAsRequester] = useState<Favour[]>([]);
    const [asHelper, setAsHelper] = useState<Favour[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [roleTab, setRoleTab] = useState<"requester" | "helper">("requester");

    useEffect(() => {

        if (!user?.id) return;

        Promise.all([
            getInProgressFavoursAsRequester(user.id),
            getInProgressFavoursAsHelper(user.id)
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

// closed tab
function ClosedTab(){

    const {user} = useAuth();
    const [asRequester, setAsRequester] = useState<Favour[]>([]);
    const [asHelper, setAsHelper] = useState<Favour[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [roleTab, setRoleTab] = useState<"requester" | "helper">("requester");

    useEffect(() => {

        if (!user?.id) return;

        Promise.all([
            getClosedFavoursAsRequester(user.id),
            getClosedFavoursAsHelper(user.id)
        ])
            .then(([requesterData, helperData]) => {
                setAsRequester(requesterData);
                setAsHelper(helperData);
            })
            .catch(() => setError("Failed to load closed favours."))
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

    const closedFavours = roleTab === "requester" ? asRequester : asHelper;

      return (
    <View style={styles.inProgressContainer}>
      
        {/* Role switcher */}
        <View style={styles.roleSwitcher}>
            
            <Pressable
                style={[
                    styles.roleSwitcherBtn,
                    roleTab === "requester" && styles.roleSwitcherBtnActive
            ]}
                onPress={() => setRoleTab("requester")}
            >
                <Text
                    style={[
                    styles.roleSwitcherText,
                    roleTab === "requester" && styles.roleSwitcherTextActive
                    ]}
                >As Requester
                </Text>
            </Pressable>

            <Pressable
                style={[
                    styles.roleSwitcherBtn,
                    roleTab === "helper" && styles.roleSwitcherBtnActive
            ]}
                onPress={() => setRoleTab("helper")}
            >
                <Text
                    style={[
                    styles.roleSwitcherText,
                    roleTab === "helper" && styles.roleSwitcherTextActive
                    ]}
                >As Helper
                </Text>
            </Pressable>

        </View>
    
        {closedFavours.length === 0 ? (
            <EmptyState
                message={
                    roleTab === "requester"
                    ? "No closed favours as requester."
                    : "No closed favours as helper."
            }
            />
        ) : (
            <FlatList
                data={closedFavours}
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

    const [activeTab, setActiveTab] = useState<"open" | "inprogress" | "closed">("open");
    const scrollRef = useRef<ScrollView>(null);

    const handleTabPress = useCallback((tab: "open" | "inprogress" | "closed", index: number) => {
        setActiveTab(tab);
        scrollRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
    }, []);

    const handleScrollEnd = useCallback(
        (e: any) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            if (index === 0) setActiveTab("open");
            else if (index === 1) setActiveTab("inprogress");
            else setActiveTab("closed");
        },
        []
    );


    return (

        <View style={styles.container}>
            
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Favs</Text>
            </View>
        
            {/* Tab bar */}
            <View style={styles.tabBar}>
                <Pressable
                    style={styles.tabItem}
                    onPress={() => handleTabPress("open", 0)}
                >
                    <Text
                        style={[
                        styles.tabLabel,
                        activeTab === "open" && styles.tabLabelActive,
                        ]}
                        >Open
                    </Text>
                    {activeTab === "open" && <View style={styles.tabIndicator} />}
                </Pressable>
        
                <Pressable
                    style={styles.tabItem}
                    onPress={() => handleTabPress("inprogress", 1)}
                >
                    <Text
                        style={[
                        styles.tabLabel,
                        activeTab === "inprogress" && styles.tabLabelActive,
                        ]}
                        >In-Progress
                    </Text>
                    {activeTab === "inprogress" && <View style={styles.tabIndicator} />}
                </Pressable>

                <Pressable
                    style={styles.tabItem}
                    onPress={() => handleTabPress("closed", 2)}
                >
                    <Text
                        style={[
                        styles.tabLabel,
                        activeTab === "closed" && styles.tabLabelActive,
                        ]}
                    >Closed
                    </Text>
                    {activeTab === "closed" && <View style={styles.tabIndicator} />}
                </Pressable>

            </View>
    
            {/* Swipeable content */}
            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleScrollEnd}
                scrollEventThrottle={16}
                style={styles.swipeScroll}
            >
                <View style={{ width: SCREEN_WIDTH }}>
                    <OpenTab />
                </View>
                <View style={{ width: SCREEN_WIDTH }}>
                    <InProgressTab />
                </View>
                <View style={{ width: SCREEN_WIDTH }}>
                    <ClosedTab />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },

    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 60,
    },
 
    // header
    header: {
        paddingTop: 60,
        paddingBottom: 16,
        paddingHorizontal: 20,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: "700",
        color: "#15b1c9",
        textAlign: "center",
    },
 
    // tab bar
    tabBar: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
    },
    tabItem: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 12,
    },
    tabLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#94a3b8",
    },
    tabLabelActive: {
        color: "#15b1c9",
    },
    tabIndicator: {
        position: "absolute",
        bottom: 0,
        height: 3,
        width: "50%",
        backgroundColor: "#15b1c9",
        borderRadius: 2,
    },
 
    // swipe scroll
    swipeScroll: {
        flex: 1,
    },
 
    // list
    listContent: {
        padding: 16,
        gap: 12,
    },

    // role switcher (in-progress tab)
    inProgressContainer: {
        flex: 1,
    },
    roleSwitcher: {
        flexDirection: "row",
        margin: 16,
        backgroundColor: "#e5e7eb",
        borderRadius: 10,
        padding: 4,
    },
    roleSwitcherBtn: {
        flex: 1,
        paddingVertical: 8,
        alignItems: "center",
        borderRadius: 8,
    },
    roleSwitcherBtnActive: {
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
    },
    roleSwitcherText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#94a3b8",
    },
    roleSwitcherTextActive: {
        color: "#15b1c9",
    },

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

    // empty state
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