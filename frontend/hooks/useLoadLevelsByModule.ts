import { getLevelsbyModule } from "@/services/api";
import { LevelSummary } from "@/types/level";
import { useEffect, useState } from "react";

interface ModuleLevelsData{
  theory_seen: boolean;
  levels: LevelSummary[];
}

export function useLoadLevelByModules(moduleId: number){ //useLocalSearchParams return strings
    const [data, setData] = useState<ModuleLevelsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
      async function loadLevels(){
        try{
          const data: ModuleLevelsData =  await getLevelsbyModule(Number(moduleId));
            setData(data);
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

    return {data, loading, error};
}