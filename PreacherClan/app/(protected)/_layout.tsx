import { Stack, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { useUser } from '@/context/userContext'

export default function ProtectedLayout() {
  const { user, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/(promo)/GettingStarted')
    }
  }, [user, loading])

  if (loading || !user) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false, animation: 'fade' }}
      />
      <Stack.Screen
        name="profile"
        options={{ headerShown: false, animation: 'slide_from_right' }}
      />
      <Stack.Screen 
        name='onboarding'
        options={{ headerShown: false, animation: 'slide_from_right' }}
      />
      <Stack.Screen 
        name='split'
        options={{ headerShown: false, animation: 'slide_from_right' }}
      />
    </Stack>

  );
}
