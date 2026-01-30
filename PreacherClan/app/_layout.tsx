import 'react-native-reanimated'

import { DarkTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { View } from 'react-native'

import '../global.css'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { UserProvider } from '@/context/userContext'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { useToast } from '@/context/ToastContext'
import { ToastProvider } from '@/context/ToastContext'
import { registerToast } from '@/utils/showToast'
import { useNetworkWatcher } from '@/hooks/useNetworkWatcher'
import * as Notifications from "expo-notifications"
import { Platform } from 'react-native'

import { Buffer } from "buffer"
import { registerForPushNotifications } from '@/utils/registerPush'
import { usePushNotifications } from '@/hooks/usePushNotifications'
import { useLazyLocation } from "@/hooks/useLazyLocation"
import LocationBootstrap from '@/components/LocationBootStrap'
import { NotificationProvider } from '@/context/NotificationContext'

global.Buffer = Buffer
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: Platform.OS === "ios",
    shouldShowList: Platform.OS === "ios",
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export const unstable_settings = {
  anchor: '(tabs)',
}

SplashScreen.preventAutoHideAsync()

function ToastRegister() {
  const { showToast } = useToast()

  useEffect(() => {
    registerToast(showToast)
  }, [])

  return null
}



export default function RootLayout() {
  const colorScheme = useColorScheme()
  usePushNotifications();


  const [fontsLoaded] = useFonts({
    'BBH-Bartle': require('../assets/images/fonts/BBHBartle-Regular.ttf'),
    'ScienceGothic': require('../assets/images/fonts/ScienceGothic-VariableFont_CTRS,slnt,wdth,wght.ttf'),
  })

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  useEffect(() => {
    registerForPushNotifications();
  
    
  }, [])
  

  if (!fontsLoaded) return null

  return (
    <ThemeProvider value={DarkTheme}>
      <UserProvider>
      <ToastProvider>
        <ToastRegister />
        <NotificationProvider>
        <NetworkWatcher />
        <LocationBootstrap/>

      
          <GestureHandlerRootView className="flex-1">
            <View className="flex-1 bg-zinc-950">

              <Stack>
                <Stack.Screen name="(promo)" options={{ headerShown: false }} />
                <Stack.Screen name="(protected)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              </Stack>

              <StatusBar style="light" />
            </View>
          </GestureHandlerRootView>
       </NotificationProvider>
      </ToastProvider>
       </UserProvider>
    </ThemeProvider>
  )
}

function NetworkWatcher() {
  useNetworkWatcher()
  return null
}
