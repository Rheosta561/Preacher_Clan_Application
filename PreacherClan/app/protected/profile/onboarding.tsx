import { useUser } from "@/context/userContext";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Easing,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

/* =======================
   INTERFACES
======================= */

export interface SocialHandles {
  instagram?: string;
  twitter?: string;
  facebook?: string;
  youtube?: string;
}

export interface Profile {
  userId: string;
  profileImage?: string;
  coverImage?: string;
  about?: string;
  socialHandles: SocialHandles;
  fitnessGoals: string[];
  ambition: string[];
  exerciseGenre: string[];
  preacherRank?: number;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  image?: string;
  streak?: {
    count: number;
    todayUpdated: boolean;
  };
  onboardingCompleted?: boolean;
  partner?: string[];
}

/* Combined interface */
export interface UserWithProfile {
  user: User;
  profile: Profile;
}

/* =======================
   CONSTANTS
======================= */

const TOTAL_STEPS = 4;

const FITNESS_GOALS = ["Lose Weight", "Build Muscle", "Improve Stamina"];
const AMBITIONS = ["Compete", "Stay Fit", "Socialize"];
const EXERCISE_GENRES = ["Cardio", "Weight Training", "CrossFit"];

/* =======================
   COMPONENT
======================= */

export default function Onboarding() {
  const router = useRouter();
  const { user } = useUser();

  const [step, setStep] = useState(1);

  /* Images */
  const [profileImage, setProfileImage] = useState<any>(null);
  const [coverImage, setCoverImage] = useState<any>(null);

  /* Text data */
  const [about, setAbout] = useState("");
  const [social, setSocial] = useState<SocialHandles>({});

  /* Arrays */
  const [fitnessGoals, setFitnessGoals] = useState<string[]>([]);
  const [ambition, setAmbition] = useState<string[]>([]);
  const [exerciseGenre, setExerciseGenre] = useState<string[]>([]);

  /* Progress Animation */
  const progressAnim = useRef(new Animated.Value(1 / TOTAL_STEPS)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: step / TOTAL_STEPS,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [step]);

  /* =======================
     HELPERS
  ======================= */

  const pickImage = async (setter: any) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setter(result.assets[0]);
    }
  };

  const toggle = (value: string, list: string[], setter: any) => {
    setter(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    );
  };

  const next = () => step < TOTAL_STEPS && setStep(step + 1);
  const back = () => step > 1 && setStep(step - 1);

  const submit = async () => {
    try {
      if (!user) return;

      const form = new FormData();
      if (profileImage)
        form.append("profileImage", {
          uri: profileImage.uri,
          name: "profile.jpg",
          type: "image/jpeg",
        } as any);

      if (coverImage)
        form.append("coverImage", {
          uri: coverImage.uri,
          name: "cover.jpg",
          type: "image/jpeg",
        } as any);

      form.append("about", about);
      form.append("socialHandles", JSON.stringify(social));
      form.append("fitnessGoals", JSON.stringify(fitnessGoals));
      form.append("ambition", JSON.stringify(ambition));
      form.append("exerciseGenre", JSON.stringify(exerciseGenre));

      const backend = process.env.EXPO_PUBLIC_BACKEND_URL;

      await axios.post(`${backend}/profile/${user.id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      router.replace("/protected/tabs");
    } catch (err) {
      Alert.alert("Error", "Profile creation failed");
    }
  };

  /* =======================
     UI
  ======================= */

  return (
    <ScrollView className="flex-1 bg-zinc-950 px-6 pt-14">
      {/* Title */}
      <Text className="text-white text-2xl font-semibold mb-4">
        Create Your Profile
      </Text>

      {/* Progress */}
      <View className="w-full bg-zinc-900 rounded-full h-2 mb-6 overflow-hidden">
        <Animated.View
          className="bg-green-500 h-2 rounded-full"
          style={{
            width: progressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            }),
          }}
        />
      </View>

      {/* STEP 1 */}
      {step === 1 && (
        <View className="space-y-4">
          <TouchableOpacity
            onPress={() => pickImage(setProfileImage)}
            className="bg-zinc-900 p-4 rounded-lg"
          >
            <Text className="text-white text-center">Pick Profile Image</Text>
          </TouchableOpacity>

          {profileImage && (
            <Image
              source={{ uri: profileImage.uri }}
              className="h-24 w-24 rounded-full self-center"
            />
          )}

          <TouchableOpacity
            onPress={() => pickImage(setCoverImage)}
            className="bg-zinc-900 p-4 rounded-lg"
          >
            <Text className="text-white text-center">Pick Cover Image</Text>
          </TouchableOpacity>

          {coverImage && (
            <Image
              source={{ uri: coverImage.uri }}
              className="h-28 w-full rounded-lg"
            />
          )}
        </View>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <View>
          <Text className="text-zinc-300 mb-2">About you</Text>
          <TextInput
            value={about}
            onChangeText={setAbout}
            multiline
            className="bg-zinc-900 text-white p-4 rounded-lg min-h-[120px]"
          />
        </View>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <View className="space-y-3">
          {["instagram", "twitter", "facebook", "youtube"].map((key) => (
            <TextInput
              key={key}
              placeholder={key}
              placeholderTextColor="#777"
              className="bg-zinc-900 text-white p-3 rounded-lg"
              onChangeText={(v) => setSocial({ ...social, [key]: v })}
            />
          ))}
        </View>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <View className="space-y-4">
          <Text className="text-white font-semibold">Fitness Goals</Text>
          <View className="flex-row flex-wrap gap-2">
            {FITNESS_GOALS.map((g) => (
              <TouchableOpacity
                key={g}
                onPress={() => toggle(g, fitnessGoals, setFitnessGoals)}
                className={`px-4 py-2 rounded-full ${
                  fitnessGoals.includes(g) ? "bg-green-700" : "bg-zinc-900"
                }`}
              >
                <Text className="text-white">{g}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text className="text-white font-semibold">Ambition</Text>
          <View className="flex-row flex-wrap gap-2">
            {AMBITIONS.map((a) => (
              <TouchableOpacity
                key={a}
                onPress={() => toggle(a, ambition, setAmbition)}
                className={`px-4 py-2 rounded-full ${
                  ambition.includes(a) ? "bg-green-700" : "bg-zinc-900"
                }`}
              >
                <Text className="text-white">{a}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text className="text-white font-semibold">Exercise Genre</Text>
          <View className="flex-row flex-wrap gap-2">
            {EXERCISE_GENRES.map((e) => (
              <TouchableOpacity
                key={e}
                onPress={() => toggle(e, exerciseGenre, setExerciseGenre)}
                className={`px-4 py-2 rounded-full ${
                  exerciseGenre.includes(e) ? "bg-green-700" : "bg-zinc-900"
                }`}
              >
                <Text className="text-white">{e}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* NAV */}
      <View className="flex-row justify-between mt-8 mb-16">
        {step > 1 && (
          <TouchableOpacity onPress={back}>
            <Text className="text-zinc-400">Back</Text>
          </TouchableOpacity>
        )}

        {step < TOTAL_STEPS ? (
          <TouchableOpacity onPress={next}>
            <Text className="text-green-400">Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={submit}>
            <Text className="text-green-400">Submit</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}
