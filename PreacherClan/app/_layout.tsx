import { enableScreens } from "react-native-screens";
enableScreens(true);
import "react-native-reanimated";




import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { UserProvider } from "@/context/userContext";
import { ToastProvider, useToast } from "@/context/ToastContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { registerToast } from "@/utils/showToast";

import * as Notifications from "expo-notifications";
import { Buffer } from "buffer";

import "../global.css";

global.Buffer = Buffer;

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: Platform.OS === "ios",
    shouldShowList: Platform.OS === "ios",
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function ToastRegister() {
  const { showToast } = useToast();

  useEffect(() => {
    registerToast(showToast);
  }, [showToast]);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "BBH-Bartle": require("../assets/images/fonts/BBHBartle-Regular.ttf"),
    ScienceGothic: require("../assets/images/fonts/ScienceGothic-VariableFont_CTRS,slnt,wdth,wght.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

 
  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#09090b" }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DarkTheme}>
        <UserProvider>
          <ToastProvider>
            <ToastRegister />
            <NotificationProvider>
              <View style={{ flex: 1, backgroundColor: "#09090b" }}>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="promo" />
                  <Stack.Screen name="auth" />
                  <Stack.Screen name="protected" />
                </Stack>
                <StatusBar style="light" />
              </View>
            </NotificationProvider>
          </ToastProvider>
        </UserProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
