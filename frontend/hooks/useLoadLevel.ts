import { getLevel } from "@/services/api";
import { Level } from "@/types/level";
import { useEffect, useState } from "react";

export function useLoadLevel(moduleId: number | string, levelId: number | string){ //useLocalSearchParams return strings
    const [level, setLevel] = useState<Level | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
      let cancelled = false;

      setLevel(null); //reset state when levelId changes so obsolet data never shown
      setLoading(true);
      setError('');

      async function loadLevel(){
        try{
          const data = await getLevel(Number(moduleId), Number(levelId));
          if(!cancelled){
              setLevel(data);
          }
        }
        catch(err: any){
          if(!cancelled){
            setError(err.message || 'Error loading level');
          }
        }
        finally{
          if(!cancelled){
            setLoading(false);
          }
        }
      }
      if(moduleId && levelId){
        loadLevel();
      }

      return () => {cancelled = true;}
    }, [moduleId, levelId]);

    return {level, loading, error};
}