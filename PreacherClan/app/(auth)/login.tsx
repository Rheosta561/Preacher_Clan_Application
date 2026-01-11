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
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import { IUser } from '@/constants/constants'

/* ---------------- GOOGLE CONFIG ---------------- */
GoogleSignin.configure({
  webClientId: '', // add when ready
})

export default function Login() {
  const router = useRouter()
  const { user, saveUser } = useUser()

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

      const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL
      console.log(backendUrl)

      const response = await axios.post(`${backendUrl}/auth/login`, {
        email,
        password,
        mobileUser: true,
      })
      // console.log(response)

      console.log('Login successfull ', response.status === 200  );

      if (response.status === 200) {
        const { _id, name, email, username } = response.data.user

        const userData: IUser = {
          id: _id,
          name,
          email,
          username,
          preacherScore : response.data.user.preacherScore || 0  , 
          partner: response.data.user.partner || [],
        }

        await saveUser(userData)
        await socketService.connect(_id);
        router.replace('/(protected)/(tabs)')
      }
      if(response.status === 401){
        setError('Incorrect username/email or password.')
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Invalid email or password')
      } else if (err.response?.status === 404) {
        setError('User not found')
      } else {
        console.error('Login error:', err)
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

// google sign in  to be continued 
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      const response = await GoogleSignin.signIn()

      if (isSuccessResponse(response)) {
        console.log('Google user:', response.data)
      } else {
        Alert.alert('Sign in cancelled')
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            Alert.alert('Sign in already in progress')
            break
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert('Play Services not available')
            break
          default:
            Alert.alert('Google sign-in failed')
        }
      } else {
        Alert.alert('Unknown error occurred')
      }
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
            source={{ uri: 'https://www.svgrepo.com/show/475656/google-color.svg' }}
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
