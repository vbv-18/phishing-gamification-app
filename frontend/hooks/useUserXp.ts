import { useState } from "react";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { getUserXp } from "@/services/api";

export function useUserXp(){
    const [xp, setXp] = useState<number | null>(null);

    useFocusEffect(
        useCallback(() => {
            async function loadXp(){
                try{
                    const data = await getUserXp();
                    setXp(data.xp);
                }
                catch(e){
                    //already managed
                }
            }
            loadXp();
        }, [])
    );
    return {xp};
}