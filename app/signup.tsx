import React, { useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Pressable,
    Platform,
    Dimensions,
    ScrollView
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import FavXHeart from "../assets/icons/favx-heart.svg";

export default function Signup(){

    const [fullname, setFullname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const { width } = Dimensions.get("window");

    const cardWidth = useMemo(() => {
        const max = 390;
        const sidePadding = 26;
        return Math.min(max, width - sidePadding * 2);
    }, [width]);

    return (

        <LinearGradient
            colors={["#A9DDE8", "#2F7FA1"]}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            style={styles.bg}
        >
            <ScrollView 
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.heartContainer}>
                        <FavXHeart width={80} height={80} />
                    </View>
                    <Text style={styles.brand}>FavX</Text>
                    <Text style={styles.sub1}>Favour for favour.</Text>
                    <Text style={styles.sub1}>Community made <Text style={{ fontWeight: "bold" }}>stronger</Text></Text>
                    <View style={styles.underline} />
                </View>

                {/* Card */}
                <View style={[styles.card, { width: cardWidth }]}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.helper}>Join the community!</Text>

                    <View style={styles.inputWrap}>
                        <TextInput
                            value={fullname}
                            onChangeText={setFullname}
                            placeholder="Full Name"
                            placeholderTextColor="#A7B4BE"
                            autoCapitalize="words"
                            style={styles.input}
                        />
                    </View>

                
            </ScrollView>
        </LinearGradient>
            


    )

    
}

const styles = StyleSheet.create({})