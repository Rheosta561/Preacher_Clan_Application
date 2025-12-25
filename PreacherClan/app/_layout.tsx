import 'react-native-reanimated';

import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';

import '../global.css';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { UserProvider } from '@/context/userContext';
import { Protected } from 'expo-router/build/views/Protected';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

export const unstable_settings = {
  anchor: '(tabs)',
};


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    'BBH-Bartle': require('../assets/images/fonts/BBHBartle-Regular.ttf'),
    'ScienceGothic' : require('../assets/images/fonts/ScienceGothic-VariableFont_CTRS,slnt,wdth,wght.ttf')
    // 'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
    // 'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
    // 'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);


  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DarkTheme}>
      <UserProvider>
        <GestureHandlerRootView>
          <Toast/>
          <View className="flex-1 bg-zinc-950">

        <Stack>
          {/* <Stack.Screen name="login" options={{ headerShown: false }} /> */}
          <Stack.Screen name="(promo)" options={{ headerShown: false }} />
          <Stack.Screen name="(protected)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="light" />
      </View>

        </GestureHandlerRootView>
      
      </UserProvider>
    </ThemeProvider>
  );
}
