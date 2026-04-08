import { Stack, Redirect } from 'expo-router';
import { View } from 'react-native';
import { useAuth } from 'context/AuthContext';
import BottomHeader from '@/components/BottomHeader';

export default function UserLayout() {
  const {isAuthenticated, loading} = useAuth();

  if(loading){
    return null;
  }

  if(!isAuthenticated){
    return <Redirect href="/"></Redirect>
  }

  return(
  <View style={{flex: 1}}>
    <Stack screenOptions={{ headerShown: false }} />
    <BottomHeader></BottomHeader>
  </View>
  )
}
