import { Stack, Redirect } from 'expo-router';
import { useAuth } from 'context/AuthContext';

export default function UserLayout() {
  const {isAuthenticated, loading} = useAuth();

  if(loading){
    return null;
  }

  if(!isAuthenticated){
    return <Redirect href="/"></Redirect>
  }

  return <Stack screenOptions={{ headerShown: false }} />
}
