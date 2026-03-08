import { getLevel } from "@/services/api";
import { useEffect, useState } from "react";

export function useLoadLevel(levelId: string | string[]){ //useLocalSearchParams return strings
    const [level, setLevel] = useState<any>(null); //replace any for defining types
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
      setLevel(null); //reset state when levelId changes so obsolet data never shown
      setLoading(true);
      setError('');
      async function loadLevel(){
        try{
          const data = await getLevel(Number(levelId));
            setLevel(data);
        }
        catch(err: any){
            setError(err.message || 'Error loading level');
        }
        finally{
          setLoading(false);
        }
      }
      loadLevel();
    }, [levelId]);

    return {level, loading, error};
}