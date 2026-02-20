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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";


import FavXHeart from "../assets/icons/favx-heart.svg"; 

// dummy account for testing, no real auth logic implemented yet
const DUMMY_USER = {
  email: "dummy@dummy.com",
  username: "dummy123",
  password: "password123!"
}

export default function Login() {
  const [email, setEmail] = useState("user@testmail.com");
  const [password, setPassword] = useState("••••••••••••");
  const [remember, setRemember] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const { width } = Dimensions.get("window");

  const cardWidth = useMemo(() => {
    const max = 390;
    const sidePadding = 26;
    return Math.min(max, width - sidePadding * 2);
  }, [width]);

  // this is just a placeholder function to demonstrate error handling in the form
  const handleLogin = () => {

    // clear previous errors
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    let hasError = false;

    // basic validation
    if(!email.trim()){
      setEmailError("Email is required.");
      hasError = true;
    }

    if(!password){
      setPasswordError("Password is required.");
      hasError = true;
    }

    if(hasError) return;

    // fake auth check against dummy user
    const emailMatch = email.trim().toLowerCase() === DUMMY_USER.email;
    const passwordMatch = password === DUMMY_USER.password;

    if(!emailMatch || !passwordMatch){
      setGeneralError("Invalid email or password.");
      return;
    }

    router.replace("/(tabs)"); // fake success for now
  }

  return (
    <LinearGradient
      colors={["#A9DDE8", "#2F7FA1"]}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.bg}
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
        <Text style={styles.title}>Login</Text>
        <Text style={styles.helper}>Enter your email and password to log in</Text>

        {/* General error message */}
        {generalError ? (
          <View style={styles.generalErrorWrap}>
            <Ionicons name="alert-circle-outline" size={14} color="#D94F4F" />
            <Text style={styles.generalErrorText}>{generalError}</Text>
          </View>
        ) : null}

        <View style={[
          styles.inputWrap,
          emailError ? styles.inputWrapError : null
        ]}>
          <TextInput
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              if (emailError) setEmailError("");
              if (generalError) setGeneralError("");
            }}
            placeholder="Email"
            placeholderTextColor="#A7B4BE"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
        </View>
        {emailError ? <Text style={styles.fieldError}>{emailError}</Text> : null}

        <View style={[
          styles.inputWrap,
          passwordError ? styles.inputWrapError : null
        ]}>
          <TextInput
            value={password}
            onChangeText={(v) => {
              setPassword(v);
              if (passwordError) setPasswordError("");
              if (generalError) setGeneralError("");
            }}
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
        {passwordError ? <Text style={styles.fieldError}>{passwordError}</Text> : null}

        <View style={styles.row}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setRemember((v) => !v)}
            style={styles.rememberRow}
          >
            <View style={[styles.checkbox, remember && styles.checkboxOn]}>
              {remember ? (
                <Ionicons name="checkmark" size={14} color="#fff" />
              ) : null}
            </View>
            <Text style={styles.rememberText}>Remember me</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.85}>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.loginBtn}
          onPress={() => router.replace("/(tabs)")} // fake success for now
        >
          <LinearGradient
            colors={["#67CBD6", "#3BA8C1"]}
            start={{ x: 0.05, y: 0 }}
            end={{ x: 0.95, y: 1 }}
            style={styles.loginBtnInner}
          >
            <Text style={styles.loginText}>Login</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.or}>Or login with</Text>

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
          <Text style={styles.bottomText}>Don’t have an account?</Text>
          <TouchableOpacity activeOpacity={0.85} onPress={() => router.push("/signup")}>
            <Text style={styles.signup}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, alignItems: "center" },

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
  sub2: {
    fontSize: 13.5,
    color: "rgba(255,255,255,0.95)",
    fontWeight: "700",
    marginTop: 2,
  },

  underline: {position: "absolute",
  left: -50,
  right: 0.1,
  height: 10,                 
  borderRadius: 999,
  backgroundColor: "rgba(255,255,255,0.88)",
  bottom: -1,
  transform: [{ translateX: 100 }, { translateY: -8 }, { rotate: "-5deg" }, { scaleX: 0.1 }, { scaleY: 0.4 },],
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

  generalErrorWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  generalErrorText: {
    fontSize: 12,
    color: "#D94F4F",
    flex: 1,
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
  input: {
    fontSize: 13.5,
    color: "#111827",
    paddingVertical: Platform.OS === "android" ? 6 : 8,
  },
  inputWrapError: {
    borderColor: "#D94F4F",
    backgroundColor: "#FEF2F2",
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

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  rememberRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  checkbox: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#D6DEE6",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxOn: { backgroundColor: "#3EA7BF", borderColor: "#3EA7BF" },
  rememberText: { fontSize: 12, color: "#7A8792" },
  forgot: { fontSize: 12, color: "#3EA7BF", fontWeight: "700" },

  loginBtn: { marginTop: 14, borderRadius: 12, overflow: "hidden" },
  loginBtnInner: {
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  loginText: { color: "#FFFFFF", fontSize: 14.5, fontWeight: "800" },

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
  signup: { fontSize: 12, color: "#3EA7BF", fontWeight: "800" },
});
