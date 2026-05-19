import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import AppHeader from "../ui/AppHeader";
import { TheorySection } from "@/types/module";

export default function ModuleTheory(){
    const {moduleId, theory, moduleTitle} = useLocalSearchParams()
    const router = useRouter()
    const sections: TheorySection[] = JSON.parse(theory as string);
    
    const [activeSection, setActiveSesion] = useState(0);
    const [expandItems, setExpandItems] = useState<Record<string, boolean>>({});


}