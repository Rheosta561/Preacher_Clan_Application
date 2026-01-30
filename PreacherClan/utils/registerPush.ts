import * as Notifications from "expo-notifications"
import * as Device from "expo-device"
import { Platform } from "react-native"

export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    console.log("Must use physical device for Push Notifications")
    // return null
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#000000",
    })
  }

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync()

  let finalStatus = existingStatus
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== "granted") {
    console.log("Permission not granted")
    return null
  }

  const token = (
    await Notifications.getExpoPushTokenAsync()
  ).data

  console.log("Expo Push Token:", token)
  return token
}
