import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { socketService } from '@/utils/socket'
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native'
import axios from 'axios'

import { useUser } from '@/context/userContext'
import { showToast } from '@/utils/showToast'
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin'

import { registerForPushNotifications } from '@/utils/registerPush'
import { IUser } from '@/constants/constants'
import { apiFetch } from '@/utils/Auth/apiFetch'
import * as SecureStore from 'expo-secure-store'

interface LoginResponse {
  message: string
  accessToken: string
  refreshToken: string
  user: {
    _id: string
    name: string
    email: string
    username: string
    preacherScore?: number
    partner?: any[]
    onboardingCompleted? : boolean 
  }

}




// google configs 

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  offlineAccess: true,     
  forceCodeForRefreshToken: true,
})

export default function Login() {
  const router = useRouter()
  const { user, saveUser } = useUser()

  const savePushTokenToServer = async (userId: string) => {
  try {
    const token = await registerForPushNotifications()
    if (!token) return

    await apiFetch("/auth/push-token", {
      method: "POST",
      body: {
        token,
        userId,
      },
    })
    console.log('token saved ', token );
  } catch (err) {
    console.log("Failed to save push token:", err)
  }
}


  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

// autoredirect 
  useEffect(() => {
    if (user) {
      router.replace('/(protected)/(tabs)')
    }
  }, [user])

// traditional login 
const handleLogin = async () => {
  if (!email || !password) {
    setError('Email and password are required')
    return
  }

  try {
    setLoading(true)
    setError(null)

    const data = await apiFetch<LoginResponse>(
      '/auth/login',
      {
        method: 'POST',
        body: {
          email,
          password,
          mobileUser: true,
        },
      }
    )

    await SecureStore.setItemAsync('accessToken', data.accessToken)
    await SecureStore.setItemAsync('refreshToken', data.refreshToken)

    const userData: IUser = {
      id: data.user._id,
      name: data.user.name,
      email: data.user.email,
      username: data.user.username,
      preacherScore: data.user.preacherScore ?? 0,
      partner: data.user.partner ?? [],
    }

    await saveUser(userData)
     showToast({type:"success" , message:"Login Successfull " , title:"Welcome back to the Clan"})
    await socketService.connect(userData.id)
    await savePushTokenToServer(userData.id);

    router.replace('/(protected)/(tabs)')
  } catch (err: any) {
    setError(err.message || 'Login failed')
  } finally {
    setLoading(false)
  }
}



const signIn = async () => {
  try {
    await GoogleSignin.hasPlayServices()

    const response = await GoogleSignin.signIn()

    if (!isSuccessResponse(response)) {
      Alert.alert('Google sign-in cancelled')
      return
    }

    const { idToken, user } = response.data

    if (!idToken) {
      throw new Error('Google ID Token not received')
    }

    console.log('ID TOKEN:', idToken)
    console.log('Google user:', user)

    // Send idToken to backend
    const res = await apiFetch<LoginResponse>('/auth/google-auth', {
      method: 'POST',
      body: {
        idToken,
        mobileUser: true,
      },
    })

    await SecureStore.setItemAsync('accessToken', res.accessToken)
    await SecureStore.setItemAsync('refreshToken', res.refreshToken)

    const userData: IUser = {
      id: res.user._id,
      name: res.user.name,
      email: res.user.email,
      username: res.user.username,
      preacherScore: res.user.preacherScore ?? 0,
      partner: res.user.partner ?? [],
      onboardingCompleted : res.user.onboardingCompleted
    }

    await saveUser(userData)
    showToast({type:"success" , message:"successfully registered " , title:"Welcome to the Clan"})
    await socketService.connect(userData.id)
    await savePushTokenToServer(userData.id);
    if (!res.user.onboardingCompleted) {
      router.replace("/(protected)/onboarding");
    } else {
      router.replace("/(protected)/(tabs)");
    }
  } catch (err: any) {
    Alert.alert(err.message || 'Google sign-in failed')
  }
}



  return (
    <View className="flex-1 bg-black/60 items-center justify-center px-6">
      <View className="w-full max-w-md bg-black/70 rounded-2xl p-6">

        <Text className="text-white text-2xl font-semibold text-center mb-6">
          Login
        </Text>

        {/* Google Login */}
        <TouchableOpacity
          onPress={signIn}
          className="flex-row items-center justify-center bg-zinc-900 py-3 rounded-lg mb-4"
        >
          <Image
            source={require('@/assets/images/google.png')}
            className="w-5 h-5 mr-3"
          />
          <Text className="text-zinc-100 text-sm">
            Log in with Google
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center my-4">
          <View className="flex-1 h-[1px] bg-zinc-400" />
          <Text className="mx-3 text-zinc-200">Or</Text>
          <View className="flex-1 h-[1px] bg-zinc-400" />
        </View>

        {/* Email */}
        <View className="mb-4">
          <Text className="text-zinc-200 text-sm mb-1">Email</Text>
          <TextInput
            value={email}
            onChangeText={(t) => {
              setEmail(t)
              setError(null)
            }}
            placeholder="Enter your email"
            placeholderTextColor="#aaa"
            autoCapitalize="none"
            className="bg-black/50 text-white p-3 rounded-lg text-sm"
          />
        </View>

        {/* Password */}
        <View className="mb-2">
          <Text className="text-zinc-200 text-sm mb-1">Password</Text>
          <TextInput
            value={password}
            onChangeText={(t) => {
              setPassword(t)
              setError(null)
            }}
            placeholder="••••••••"
            placeholderTextColor="#aaa"
            secureTextEntry
            className="bg-black/50 text-white p-3 rounded-lg text-sm"
          />
        </View>

        {/* Error */}
        {error && (
          <Text className="text-red-500 text-sm mt-2 text-center">
            {error}
          </Text>
        )}

        {/* Remember me */}
        <View className="flex-row items-center justify-between my-4">
          <TouchableOpacity
            onPress={() => setRememberMe(!rememberMe)}
            className="flex-row items-center"
          >
            <View
              className={`w-4 h-4 mr-2 border rounded ${
                rememberMe ? 'bg-white' : 'border-white'
              }`}
            />
            <Text className="text-zinc-200 text-sm">
              Remember me
            </Text>
          </TouchableOpacity>

          <Text className="text-zinc-200 text-sm">
            Forgot password?
          </Text>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          disabled={loading}
          onPress={handleLogin}
          className={`py-3 rounded-lg mt-2 ${
            loading ? 'bg-zinc-700' : 'bg-zinc-900'
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center text-sm">
              Sign in to your account
            </Text>
          )}
        </TouchableOpacity>

        {/* Signup */}
        <View className="mt-4 flex-row justify-center">
          <Text className="text-zinc-200 text-sm">
            Don’t have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text className="text-blue-500 text-sm underline">
              Sign up here
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  )
}
