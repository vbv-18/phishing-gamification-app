import { Stack, Redirect, usePathname } from 'expo-router';
import { View } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import BottomHeader from '@/components/ui/BottomHeader';

export default function LevelLayout() {
  const {isAuthenticated, loading} = useAuth();
  const pathName = usePathname()

  if(loading){
    return null;
  }

  if(!isAuthenticated){
    return <Redirect href="/"></Redirect>
  }

  const showBottomHeader = pathName.endsWith('/home') || pathName.endsWith('/moduleHome');

  return(
    <View style={{flex: 1}}>
      <Stack screenOptions={{ headerShown: false }} />
      {showBottomHeader && <BottomHeader></BottomHeader>}
    </View>
  );
}
