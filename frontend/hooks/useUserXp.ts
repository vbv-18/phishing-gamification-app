import { useState } from "react";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { getUserXp } from "@/services/api";

interface UserXpData{
    xp: number;
    level: number;
    xp_for_next_level: number | null;
    role: string;
    is_max_level: boolean;
}

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
    return {xp: xpData?.xp ?? null, level: xpData?.level ?? null, xp_for_next_level: xpData?.xp_for_next_level ?? null, role: xpData?.role ?? null, is_max_level: xpData?.is_max_level ?? false,};
}