import { View, Text } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const clanLayout = () => {
    const params = useLocalSearchParams();
      const chatTitle =
        typeof params?.name === "string" && params?.name.length > 0
          ? params.name
          : "Raven Speak";
  return (
    <Stack>
        <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          animation: "fade",
          title: chatTitle,
          headerStyle: { backgroundColor: "#0a0a0a" },
          headerTitleStyle: {
            fontFamily: "BBH-Bartle",
            fontSize: 16,
            color: "#ffffff",
          },
          headerTitleAlign: "center",
          headerTintColor: "#ffffff",
        }}
      />

    </Stack>
  )
}

export default clanLayout