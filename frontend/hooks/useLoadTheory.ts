import { useEffect, useState } from "react";
import { getModuleTheory } from "@/services/api";
import { TheoryData } from "@/types/module";

export function useLoadTheory(moduleId: number | string){
    const [theoryData, setTheoryData] = useState<TheoryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setTheoryData(null);
        setLoading(true);
        setError('');

        async function load(){
            try{
                const data = await getModuleTheory(Number(moduleId));
                setTheoryData(data);
            }
            catch(err: any){
                setError(err.message || 'Error loading theory');
            }
            finally {
                setLoading(false);
            }
        }
        if(moduleId){
            load();
        }
    }, [moduleId]);

    return {theoryData, loading, error};
}