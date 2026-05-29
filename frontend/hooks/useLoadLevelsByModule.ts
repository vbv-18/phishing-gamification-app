import { getLevelsbyModule } from "@/services/api";
import { LevelSummary } from "@/types/level";
import { useEffect, useState } from "react";

interface ModuleLevelsData{
  theory_seen: boolean;
  levels: LevelSummary[];
}

export function useLoadLevelsByModules(moduleId: number){ //useLocalSearchParams return strings
    const [data, setData] = useState<ModuleLevelsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
      let cancelled = false;

      async function loadLevels(){
        try{
          const data: ModuleLevelsData =  await getLevelsbyModule(Number(moduleId));
          if(!cancelled){
            setData(data);
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
      if(moduleId){
        loadLevels();
      }

      return () => {cancelled = true;}
    }, [moduleId]);
    
    return {data, loading, error};
}