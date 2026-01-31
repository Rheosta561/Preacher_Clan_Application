import { Stack } from "expo-router";
import React from "react";
import { View } from "react-native";


export default function AuthLayout() {
  return (
    <Stack>

      <Stack.Screen name="login" options={{ headerShown: false , animation: 'fade' }} />
      <Stack.Screen name="signup" options={{ headerShown: false , animation: 'fade' }} />
    </Stack>
  );
}