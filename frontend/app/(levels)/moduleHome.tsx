import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";

export default function ModuleHome(){
    const {moduleId} = useLocalSearchParams();
    const router = useRouter();
    const [levels, setLevels] = useState([]);

    useEffect(() => {
        fetch
    })
}