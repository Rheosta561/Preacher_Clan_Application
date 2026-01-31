import LocationBootstrap from "@/components/LocationBootStrap";
import { ChallengeProvider } from "@/context/ChallengeContext";
import { ChatProvider } from "@/context/ChatContext";
import { SocketProvider } from "@/context/socketContext";
import { useUser } from "@/context/userContext";
import { useNetworkWatcher } from "@/hooks/useNetworkWatcher";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { registerForPushNotifications } from "@/utils/registerPush";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function ProtectedLayout() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/promo/GettingStarted");
      return;
    }
    console.log(user);
    if (!user.onboardingCompleted) {
      router.replace("/protected/onboarding");
    } else {
      router.replace("/protected/tabs");
    }
  }, [user, loading]);

  usePushNotifications();

  useEffect(() => {
    registerForPushNotifications();
  }, []);

  if (loading || !user) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SocketProvider>
      <ChatProvider>
        <ChallengeProvider>
          <NetworkWatcher />

          <LocationBootstrap />

          <Stack>
            <Stack.Screen
              name="tabs"
              options={{ headerShown: false, animation: "fade" }}
            />
            <Stack.Screen
              name="profile"
              options={{ headerShown: false, animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="onboarding"
              options={{ headerShown: false, animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="split"
              options={{ headerShown: false, animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="chats"
              options={{ headerShown: false, animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="challenge"
              options={{ headerShown: false, animation: "slide_from_left" }}
            />
            <Stack.Screen
              name="clan"
              options={{ headerShown: false, animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="notification"
              options={{ headerShown: false, animation: "slide_from_bottom" }}
            />
            <Stack.Screen
              name="jam"
              options={{ headerShown: false, animation: "slide_from_right" }}
            />
          </Stack>
        </ChallengeProvider>
      </ChatProvider>
    </SocketProvider>
  );
}

function NetworkWatcher() {
  useNetworkWatcher();
  return null;
}
