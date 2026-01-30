import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { useState } from 'react'
import { apiFetch } from '@/utils/Auth/apiFetch'
import * as SecureStore from 'expo-secure-store'


import { useUser } from '@/context/userContext'
import { IUser } from '@/constants/constants'
import { showToast } from '@/utils/showToast'
import { socketService } from '@/utils/socket'
import { Alert } from 'react-native'
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin'
interface SignUpResponse {
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
    onboardingCompleted ? : boolean 
  }

}

export default function SignUp() {
  const router = useRouter()
  const { saveUser } = useUser()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL


  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    offlineAccess: true,     
    forceCodeForRefreshToken: true,
  })

  const handleGoogleSignup = async () => {
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
        const res = await apiFetch<SignUpResponse>('/auth/google-auth', {
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
        }
    
        await saveUser(userData)
        showToast({type:"success" , message:"successfully registered " , title:"Welcome to the Clan"})
        await socketService.connect(userData.id)

        if (!res.user.onboardingCompleted) {
          router.replace("/(protected)/onboarding");
        } else {
          router.replace("/(protected)/(tabs)");
        }
      } catch (err: any) {
        Alert.alert(err.message || 'Google sign-in failed')
      }
  }

 const handleSignup = async () => {
  setError(null)

  if (!name || !email || !username || !password) {
    setError('All fields are required')
    return
  }

  try {
    setLoading(true)

    const data = await apiFetch<SignUpResponse>(
      '/auth/signup',
      {
        method: 'POST',
        body: {
          name,
          email,
          username,
          password,
          mobileUser: true,
        },
      }
    )

    console.log(data);

    //  Store tokens
    await SecureStore.setItemAsync('accessToken', data.accessToken)
    await SecureStore.setItemAsync('refreshToken', data.refreshToken)

    const userData: IUser = {
      id: data.user._id,
      name: data.user.name,
      email: data.user.email,
      username: data.user.username,
      preacherScore: data.user.preacherScore ?? 0,
      partner: data.user.partner ?? [],
      onboardingCompleted : data.user.onboardingCompleted ?? false 
    }

    await saveUser(userData)
    showToast({type:"success" , message:"successfully registered " , title:"Welcome to the Clan"})

    if (!data.user.onboardingCompleted) {
          router.replace("/(protected)/onboarding");
        } else {
          router.replace("/(protected)/(tabs)");
        }
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') {
      setError('Session expired. Please try again.')
    } else if (err.message?.includes('exists')) {
      setError('Username or email already taken')
    } else {
      console.error('Signup error:', err)
      setError('Signup failed. Please try again.')
    }
  } finally {
    setLoading(false)
  }
}


  return (
    <View className="flex-1">
      <View className="flex-1 bg-black/60 items-center justify-center px-6">
        <View className="w-full max-w-md bg-black/70 rounded-2xl p-6">

          <Text className="text-white text-2xl font-semibold text-center mb-4">
            Sign Up
          </Text>

          {/* ERROR MESSAGE */}
          {error && (
            <View className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-4">
              <Text className="text-red-400 text-sm text-center">
                {error}
              </Text>
            </View>
          )}

          {/* Google Signup */}
          <TouchableOpacity
            onPress={handleGoogleSignup}
            className="flex-row items-center justify-center bg-zinc-900 py-3 rounded-lg mb-4"
          >
            <Image
              source={require('@/assets/images/google.png')}
              className="w-5 h-5 mr-3"
            />
            <Text className="text-zinc-100 text-sm">
              Sign up with Google
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-3">
            <View className="flex-1 h-[1px] bg-zinc-400" />
            <Text className="mx-3 text-zinc-200">Or</Text>
            <View className="flex-1 h-[1px] bg-zinc-400" />
          </View>

          {/* Inputs */}
          {[
            { label: 'Name', value: name, setter: setName },
            { label: 'Email', value: email, setter: setEmail },
            { label: 'Username', value: username, setter: setUsername },
            { label: 'Password', value: password, setter: setPassword, secure: true },
          ].map((field, i) => (
            <View key={i} className="mb-3">
              <Text className="text-zinc-200 text-sm mb-1">
                {field.label}
              </Text>
              <TextInput
                value={field.value}
                onChangeText={field.setter}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                placeholderTextColor="#aaa"
                secureTextEntry={field.secure}
                autoCapitalize="none"
                className="bg-black/50 text-white p-3 rounded-lg text-sm"
              />
            </View>
          ))}

          {/* Remember me */}
          <TouchableOpacity
            onPress={() => setRememberMe(!rememberMe)}
            className="flex-row items-center mb-4"
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

          {/* Submit */}
          <TouchableOpacity
            onPress={handleSignup}
            disabled={loading}
            className={`py-3 rounded-lg ${
              loading ? 'bg-zinc-700' : 'bg-zinc-900'
            }`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center text-sm">
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          {/* Login */}
          <View className="mt-4 flex-row justify-center">
            <Text className="text-zinc-200 text-sm">
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Text className="text-blue-500 text-sm underline">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </View>
  )
}
