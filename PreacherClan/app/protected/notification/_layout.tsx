import { Stack } from 'expo-router'
import { Text } from 'react-native'

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          animation: 'fade',

          // Title text
          title: 'Notifications',

          // Header container styles
          headerStyle: {
            backgroundColor: '#0a0a0a',
          },

          headerTitleStyle: {
            fontFamily: 'BBH-Bartle', 
            fontSize: 16,
            color: '#ffffff',
          },

          // Center title (Android)
          headerTitleAlign: 'center',

          // Tint color for back button
          headerTintColor: '#ffffff',
        }}
      />
      
    </Stack>
  )
}
