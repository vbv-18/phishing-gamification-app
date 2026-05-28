import { getModules } from "@/services/api";
import { useEffect, useState } from "react";
import { Module } from "@/types/module";

export function useLoadModule(){ //useLocalSearchParams return strings
    const [modules, setModules] = useState<Module[]>([]); //replace any for defining types
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
      let cancelled = false;

      async function loadModules(){
        try{
          const data = await getModules();
          if(!cancelled){
            setModules(data);
          }
        }
        catch(err: any){
          if(!cancelled){
            setError(err.message || 'Error loading modules');
          }
        }
        finally{
          if(!cancelled){
            setLoading(false);
          }
        }
      }
      loadModules();

      return () => {cancelled = true;}
    }, []);

    return {modules, loading, error};
}