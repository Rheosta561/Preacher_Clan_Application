import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect } from "react";

export function usePushNotifications() {
  useEffect(() => {
    // App opened from background by notification tap
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        handleNavigation(response.notification.request.content.data);
      });

    // App opened from killed state
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        handleNavigation(response.notification.request.content.data);
      }
    });

    return () => {
      responseListener.remove();
    };
  }, []);
}

function handleNavigation(data: any) {
  if (!data) return;

  switch (data.type) {
    case "WORKOUT_UPDATE":
      router.push("/protected/split");
      break;

    case "GYM":
      router.push(`/protected/tabs/clan`);
      break;

    default:
      router.push("/");
  }
}
