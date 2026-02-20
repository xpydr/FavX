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

// dummy account for testing uniqueness validation
const TAKEN_USERNAMES = ["dummy123"];

export default function Signup(){

    // form states
    const [fullname, setFullname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const [errors, setErrors] = useState<Record<string, string>>({});

    const { width } = Dimensions.get("window");

    // calculate card width based on screen width
    const cardWidth = useMemo(() => {
        const max = 390;
        const sidePadding = 26;
        return Math.min(max, width - sidePadding * 2);
    }, [width]);

    // helper to clear error for a specific field when user starts typing
    const clearError = (field: string) => {
        if (errors[field]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    // for demo purposes, this just validates the fields and shows errors — no actual account creation
    const handleSignup = () => {
        const newErrors: Record<string, string> = {};

        // full name
        if (!fullname.trim()) {
            newErrors.fullName = "Full name is required.";
        }

        // username
        if (!username.trim()) {
            newErrors.username = "Username is required.";
        } else if (TAKEN_USERNAMES.includes(username.trim().toLowerCase())) {
            newErrors.username = "That username is already taken.";
        }

        // email — must contain @ and a dot after it
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!emailRegex.test(email.trim())) {
            newErrors.email = "Please enter a valid email (e.g. name@site.com).";
        }

        // password — min 6 chars, at least one number, at least one symbol
        const hasNumber = /\d/.test(password);
        const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password);
        if (!password) {
            newErrors.password = "Password is required.";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        } else if (!hasNumber) {
            newErrors.password = "Password must include at least one number.";
        } else if (!hasSymbol) {
            newErrors.password = "Password must include at least one symbol.";
        }

        // confirm password
        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password.";
        } else if (confirmPassword !== password) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        // if there are errors, show them and stop
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // all good — redirect to login
        router.replace("/login");
    };

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
                    <View style={[styles.inputWrap, errors.fullname ? styles.inputWrapError : null]}>
                        <TextInput
                            value={fullname}
                            onChangeText={(v) => {setFullname(v); clearError("fullname")}}
                            placeholder="Full Name"
                            placeholderTextColor="#A7B4BE"
                            autoCapitalize="words"
                            style={styles.input}
                        />
                    </View>
                    {errors.fullname ? (
                        <Text style={styles.fieldError}>{errors.fullname}</Text>
                    ) : null}

                    {/* Username */}
                    <View style={[styles.inputWrap, errors.username ? styles.inputWrapError : null]}>
                        <TextInput
                            value={username}
                            onChangeText={(v) => {setUsername(v); clearError("username")}}
                            placeholder="Username"
                            placeholderTextColor="#A7B4BE"
                            autoCapitalize="none"
                            style={styles.input}
                        />
                    </View>
                    {errors.username ? (
                        <Text style={styles.fieldError}>{errors.username}</Text>
                    ) : null}

                    {/* Email */}
                    <View style={[styles.inputWrap, errors.email ? styles.inputWrapError : null]}>
                        <TextInput
                            value={email}
                            onChangeText={(v) => {setEmail(v); clearError("email")}}
                            placeholder="Email"
                            placeholderTextColor="#A7B4BE"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            style={styles.input}
                        />
                    </View>
                    {errors.email ? (
                        <Text style={styles.fieldError}>{errors.email}</Text>
                    ) : null}

                    {/* Password */}
                    <View style={[styles.inputWrap, errors.password ? styles.inputWrapError : null]}>
                        <TextInput
                            value={password}
                            onChangeText={(v) => {setPassword(v); clearError("password")}}
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
                    {errors.password ? (
                        <Text style={styles.fieldError}>{errors.password}</Text>
                    ) : null}

                    {/* Confirm Password */}
                    <View style={[styles.inputWrap, errors.confirmPassword ? styles.inputWrapError : null]}>
                        <TextInput
                            value={confirmPassword}
                            onChangeText={(v) => {setConfirmPassword(v); clearError("confirmPassword")}}
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
                    {errors.confirmPassword ? (
                        <Text style={styles.fieldError}>{errors.confirmPassword}</Text>
                    ) : null}

                    {/* Signup Button */}
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.signupBtn}
                        onPress={() => router.replace("/login")}
                    >
                        <LinearGradient
                            colors={["#67CBD6", "#3BA8C1"]}
                            start={{ x: 0.05, y: 0 }}
                            end={{ x: 0.95, y: 1 }}
                            style={styles.signupBtnInner}
                        >
                            <Text style={styles.signupText}>Sign Up</Text>
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
                        <TouchableOpacity activeOpacity={0.85} onPress={() => router.replace("/login")}>
                            <Text style={styles.login}>Log In</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.scrollPad} />
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({

  bg: { flex: 1 },

  scroll: {
    alignItems: "center",
    flexGrow: 1,
  },

  header: {
    width: "100%",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 52 : 62,
    paddingBottom: 18,
  },

  heartContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.10)",
  },

  brand: {
    fontSize: 44,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.2,
    marginBottom: 6,
  },

  sub1: { fontSize: 17, color: "rgba(255,255,255,0.92)" },

  underline: {
    position: "absolute",
    left: -50,
    right: 0.1,
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.88)",
    bottom: -1,
    transform: [
      { translateX: 100 },
      { translateY: -8 },
      { rotate: "-5deg" },
      { scaleX: 0.1 },
      { scaleY: 0.4 },
    ],
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
    marginTop: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#3B3B3B",
    textAlign: "center",
  },
  helper: {
    marginTop: 8,
    marginBottom: 14,
    textAlign: "center",
    fontSize: 12,
    color: "#8A96A3",
  },

  inputWrap: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E6ECF0",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    paddingHorizontal: 12,
    marginTop: 10,
  },
  inputWrapError: {
    borderColor: "#D94F4F",
    backgroundColor: "#FEF2F2",
  },
  input: {
    fontSize: 13.5,
    color: "#111827",
    paddingVertical: Platform.OS === "android" ? 6 : 8,
  },
  eye: {
    position: "absolute",
    right: 12,
    width: 34,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  fieldError: {
    fontSize: 11,
    color: "#D94F4F",
    marginTop: 3,
    marginLeft: 4,
  },

  signupBtn: { marginTop: 16, borderRadius: 12, overflow: "hidden" },
  signupBtnInner: {
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  signupText: { color: "#FFFFFF", fontSize: 14.5, fontWeight: "800" },

  or: { textAlign: "center", marginTop: 10, fontSize: 12, color: "#99A5B0" },

  socialRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 14,
  },
  socialBtn: {
    width: 46,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E6ECF0",
    alignItems: "center",
    justifyContent: "center",
  },

  bottom: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomText: { fontSize: 12, color: "#7C8893" },
  login: { fontSize: 12, color: "#3EA7BF", fontWeight: "800" },

  scrollPad: { height: 32 }
})