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

                    {/* Full Name */}
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

                    {/* Username */}
                    <View style={styles.inputWrap}>
                        <TextInput
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Username"
                            placeholderTextColor="#A7B4BE"
                            autoCapitalize="none"
                            style={styles.input}
                        />
                    </View>

                    {/* Email */}
                    <View style={styles.inputWrap}>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Email"
                            placeholderTextColor="#A7B4BE"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            style={styles.input}
                        />
                    </View>

                    {/* Password */}
                    <View style={styles.inputWrap}>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Password"
                            placeholderTextColor="#A7B4BE"
                            secureTextEntry={!showPass}
                            style={[styles.input, { paddingRight: 44 }]}
                        />
                        <Pressable onPress={() => setShowPass((v) => !v)} style={styles.eye}>
                            <Ionicons
                                name={showPass ? "eye-outline" : "eye-off-outline"}
                                size={18}
                                color="#9AA7B2"
                            />
                        </Pressable>
                    </View>

                    {/* Confirm Password */}
                    <View style={styles.inputWrap}>
                        <TextInput
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Confirm Password"
                            placeholderTextColor="#A7B4BE"
                            secureTextEntry={!showConfirmPass}
                            style={[styles.input, { paddingRight: 44 }]}
                        />
                        <Pressable onPress={() => setShowConfirmPass((v) => !v)} style={styles.eye}>
                            <Ionicons
                                name={showConfirmPass ? "eye-outline" : "eye-off-outline"}
                                size={18}
                                color="#9AA7B2"
                            />
                        </Pressable>
                    </View>

                    {/* Signup Button */}
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.signupBtn}
                        onPress={() => router.replace("/(tabs)")}
                    >
                        <LinearGradient
                            colors={["#67CBD6", "#3BA8C1"]}
                            start={{ x: 0.05, y: 0 }}
                            end={{ x: 0.95, y: 1 }}
                            style={styles.signupBtnInner}
                        >
                            <Text style={styles.signupBtnText}>Sign Up</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <Text style={styles.or}>Or sign up with</Text>

                    <View style={styles.socialRow}>
                        <TouchableOpacity style={styles.socialBtn} activeOpacity={0.85}>
                            <Ionicons name="logo-google" size={18} color="#111827" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialBtn} activeOpacity={0.85}>
                            <Ionicons name="logo-facebook" size={18} color="#111827" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialBtn} activeOpacity={0.85}>
                            <Ionicons name="logo-apple" size={18} color="#111827" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialBtn} activeOpacity={0.85}>
                            <Ionicons name="call-outline" size={18} color="#111827" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.bottom}>
                        <Text style={styles.bottomText}>Already have an account?</Text>
                        <TouchableOpacity activeOpacity={0.85} onPress={() => router.back()}>
                            <Text style={styles.login}>Log In</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.scrollPad} />
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({})