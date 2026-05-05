import { getLevel, getLevelsbyModule } from "@/services/api";
import { Level } from "@/types/level";
import { useEffect, useState } from "react";

export function useLoadLevelByModules(moduleId: number){ //useLocalSearchParams return strings
    const [levels, setLevels] = useState<Level[] | null>(null); //replace any for defining types
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
      async function loadLevels(){
        try{
          const data = await getLevelsbyModule(Number(moduleId));
            setLevels(data);
        }
        catch(err: any){
            setError(err.message || 'Error loading level');
        }
        finally{
          setLoading(false);
        }
      }
      if(moduleId){
        loadLevels();
      }
    }, [moduleId]);

    return {levels, loading, error};
}