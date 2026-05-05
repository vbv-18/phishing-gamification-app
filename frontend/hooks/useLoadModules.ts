import { getLevel, getModules } from "@/services/api";
import { useEffect, useState } from "react";
import { Module } from "@/types/module";

export function useLoadModule(){ //useLocalSearchParams return strings
    const [modules, setModules] = useState<Module[]>([]); //replace any for defining types
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
      async function loadModules(){
        try{
          const data = await getModules();
            setModules(data);
        }
        catch(err: any){
            setError(err.message || 'Error loading modules');
        }
        finally{
          setLoading(false);
        }
      }
      loadModules();
    }, []);

    return {modules, loading, error};
}