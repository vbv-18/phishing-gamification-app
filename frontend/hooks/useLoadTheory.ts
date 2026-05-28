import { useEffect, useState } from "react";
import { getModuleTheory } from "@/services/api";
import { TheoryData } from "@/types/module";

export function useLoadTheory(moduleId: number | string){
    const [theoryData, setTheoryData] = useState<TheoryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        setTheoryData(null);
        setLoading(true);
        setError('');

        async function load(){
            try{
                const data = await getModuleTheory(Number(moduleId));
                if(!cancelled){
                    setTheoryData(data);
                }
            }
            catch(err: any){
                if(!cancelled){
                    setError(err.message || 'Error loading theory');
                }
            }
            finally {
                if(!cancelled){
                    setLoading(false);
                }
            }
        }
        if(moduleId){
            load();
        }

        return () => {cancelled = true;}
    }, [moduleId]);

    return {theoryData, loading, error};
}