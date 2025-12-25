import { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useUser } from '@/context/userContext'

export const ProtectedScreen = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useUser()
  const navigation = useNavigation()

  useEffect(() => {
    if (!loading && !user) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' as never }],
      })
    }
  }, [user, loading])

  if (loading || !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return <>{children}</>
}
