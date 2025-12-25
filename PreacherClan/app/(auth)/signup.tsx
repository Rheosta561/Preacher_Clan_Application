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
import axios from 'axios'

import { useUser } from '@/context/userContext'
import { IUser } from '@/constants/constants'

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

  const handleGoogleSignup = async () => {
    await WebBrowser.openBrowserAsync(
      'https://preacherclan.onrender.com/auth/google'
    )
  }

  const handleSignup = async () => {
    setError(null)

    if (!name || !email || !username || !password) {
      setError('All fields are required')
      return
    }

    try {
      setLoading(true)

      const response = await axios.post(`${backendUrl}/auth/signup`, {
        name,
        email,
        username,
        password,
        mobileUser: true,
      })

      if (response.status === 201) {
        const { _id, name, email, username } = response.data.user

        const userData: IUser = {
          id:_id,
          name,
          email,
          username,
          partner : []
        }

        await saveUser(userData)
        router.replace('/(protected)/(tabs)')
      }
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        const message =
          err.response?.data?.message || 'Signup failed'

        if (status === 409) {
          setError('Username or email already taken')
        } else if (status === 400) {
          setError('Invalid input. Please check your details.')
        } else {
          setError(message)
        }
      } else {
        setError('Something went wrong. Try again.')
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
              source={{ uri: 'https://www.svgrepo.com/show/475656/google-color.svg' }}
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
