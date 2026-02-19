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

        


    )


}