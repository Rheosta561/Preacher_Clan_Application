import { socketService } from "@/utils/socket";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useUser } from "@/context/userContext";
import { showToast } from "@/utils/showToast";
import {
  GoogleSignin,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";

import { IUser } from "@/constants/constants";
import { apiFetch } from "@/utils/Auth/apiFetch";
import { registerForPushNotifications } from "@/utils/registerPush";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

// google config
const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: {
    _id: string;
    name: string;
    email: string;
    username: string;
    preacherScore?: number;
    partner?: any[];
    onboardingCompleted?: boolean;
  };
}

export default function Login() {
  const router = useRouter();
  const { user, saveUser } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  /* Configure Google Sign-In safely */
  useEffect(() => {
    if (!webClientId) {
      console.error("❌ Google Web Client ID missing");
      return;
    }

    GoogleSignin.configure({
      webClientId,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, []);

  /* Auto redirect if already logged in */
  useEffect(() => {
    if (user) {
      router.replace("/protected/tabs");
    }
  }, [user]);

  const savePushTokenToServer = async (userId: string) => {
    try {
      const token = await registerForPushNotifications();
      if (!token) return;

      await apiFetch("/auth/push-token", {
        method: "POST",
        body: { token, userId },
      });
    } catch (err) {
      console.log("Failed to save push token:", err);
    }
  };

  /* Traditional login */
  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: { email, password, mobileUser: true },
      });
      console.log(data);
      await SecureStore.setItemAsync("accessToken", data.accessToken);
      await SecureStore.setItemAsync("refreshToken", data.refreshToken);

      const userData: IUser = {
        id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        username: data.user.username,
        preacherScore: data.user.preacherScore ?? 0,
        partner: data.user.partner ?? [],
      };

      await saveUser(userData);
      await socketService.connect(userData.id);
      await savePushTokenToServer(userData.id);

      showToast({
        type: "success",
        title: "Welcome back to the Clan",
        message: "Login successful",
      });

      router.replace("/protected/tabs");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* Google Sign-In */
  const signIn = async () => {
    if (!webClientId) {
      Alert.alert(
        "Configuration Error",
        "Google Sign-In is not configured correctly.",
      );
      return;
    }

    try {
      setGoogleLoading(true);

      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (!isSuccessResponse(response)) {
        Alert.alert("Google sign-in cancelled");
        return;
      }

      const { idToken } = response.data;
      if (!idToken) throw new Error("Google ID Token not received");

      const res = await apiFetch<LoginResponse>("/auth/google-auth", {
        method: "POST",
        body: { idToken, mobileUser: true },
      });

      await SecureStore.setItemAsync("accessToken", res.accessToken);
      await SecureStore.setItemAsync("refreshToken", res.refreshToken);

      const userData: IUser = {
        id: res.user._id,
        name: res.user.name,
        email: res.user.email,
        username: res.user.username,
        preacherScore: res.user.preacherScore ?? 0,
        partner: res.user.partner ?? [],
        onboardingCompleted: res.user.onboardingCompleted,
      };

      await saveUser(userData);
      await socketService.connect(userData.id);
      await savePushTokenToServer(userData.id);

      showToast({
        type: "success",
        title: "Welcome to the Clan",
        message: "Successfully signed in",
      });

      router.replace(
        res.user.onboardingCompleted
          ? "/protected/tabs"
          : "/protected/onboarding",
      );
    } catch (err: any) {
      console.error(err);
      Alert.alert(err.message || "Google sign-in failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-black/60 items-center justify-center px-6">
      <View className="w-full max-w-md bg-black/70 rounded-2xl p-6">
        <Text className="text-white text-2xl font-semibold text-center mb-6">
          Login
        </Text>

        {/* Google Login */}
        <TouchableOpacity
          onPress={signIn}
          disabled={googleLoading}
          className={`flex-row items-center justify-center py-3 rounded-lg mb-4 ${
            googleLoading ? "bg-zinc-700" : "bg-zinc-900"
          }`}
        >
          {googleLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Image
                source={require("@/assets/images/google.png")}
                className="w-5 h-5 mr-3"
              />
              <Text className="text-zinc-100 text-sm">Log in with Google</Text>
            </>
          )}
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
              setEmail(t);
              setError(null);
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
              setPassword(t);
              setError(null);
            }}
            placeholder="••••••••"
            placeholderTextColor="#aaa"
            secureTextEntry
            className="bg-black/50 text-white p-3 rounded-lg text-sm"
          />
        </View>

        {/* Error */}
        {error && (
          <Text className="text-red-500 text-sm mt-2 text-center">{error}</Text>
        )}

        {/* Remember me */}
        <View className="flex-row items-center justify-between my-4">
          <TouchableOpacity
            onPress={() => setRememberMe(!rememberMe)}
            className="flex-row items-center"
          >
            <View
              className={`w-4 h-4 mr-2 border rounded ${
                rememberMe ? "bg-white" : "border-white"
              }`}
            />
            <Text className="text-zinc-200 text-sm">Remember me</Text>
          </TouchableOpacity>

          <Text className="text-zinc-200 text-sm">Forgot password?</Text>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          disabled={loading}
          onPress={handleLogin}
          className={`py-3 rounded-lg mt-2 ${
            loading ? "bg-zinc-700" : "bg-zinc-900"
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
          <Text className="text-zinc-200 text-sm">Don’t have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/signup")}>
            <Text className="text-blue-500 text-sm underline">
              Sign up here
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
