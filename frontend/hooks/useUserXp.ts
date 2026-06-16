import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { getUserXp } from "@/services/api";
import { UserXpData } from "@/types/user";

export function useUserXp(){
    const [xpData, setXpData] = useState<UserXpData | null>(null);

    useFocusEffect(
        useCallback(() => {
            async function loadXp(){
                try{
                    const data: UserXpData =  await getUserXp();
                    setXpData(data);
                }
                catch(e){
                    //already managed
                }
            }
            loadXp();
        }, [])
    );
    return {
        xp: xpData?.xp ?? null,
        level: xpData?.level ?? null,
        xp_for_next_level: xpData?.xp_for_next_level ?? null,
        role: xpData?.role ?? null,
        is_max_level: xpData?.is_max_level ?? false,
        unlocked_badges: xpData?.unlocked_badges ?? [],
    };
}