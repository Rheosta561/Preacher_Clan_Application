import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { useUser } from "@/context/userContext";
import MileStoneCard from "@/components/Profile_Components/MileStoneCard";
import UserGoalCard from "@/components/Profile_Components/UserGoalCard";
import RepMateCard from "@/components/Profile_Components/RepmateCard";
import Shimmer from "@/components/ui/Shimmer";
import { IUserWithProfile, Repmate_Profile } from "@/constants/constants";
import { RepMateRequest } from "@/constants/constants";
import { apiFetch } from "@/utils/Auth/apiFetch";
import { showToast } from "@/utils/showToast";
interface removeResponse{
  message?: string 
  success?: boolean
}
interface BackendProfileResponse {
  profile: {
    _id: string
    about?: string
    ambition?: string[]
    fitnessGoals?: string[]
    exerciseGenre?: string[]
    timings?: string
    profileImage?: string
    coverImage?: string

    userId: {
      _id: string
      name: string
      username: string
      email: string
      preacherScore?: number
      isVerified?: boolean
      isTrainer?: boolean
      isAdmin?: boolean
      streak?: {
        count: number
        todayUpdated: boolean
      }
      partner?: Repmate_Profile[]
    }
  }
}


const DUMMY_REPMATES = [
  {
    _id: "1",
    name: "Ragnar Lothbrok",
    location: "Delhi, India",
    image:
      "https://img.freepik.com/free-vector/viking-warrior-with-raven_43623-950.jpg",
  },
  {
    _id: "2",
    name: "Bjorn Ironside",
    location: "Bangalore, India",
    image:
      "https://img.freepik.com/free-vector/viking-warrior-with-axe_43623-951.jpg",
  },
];

export default function Profile() {
  const { user, clearUser  } = useUser();
  const router = useRouter();

  const [profile, setProfile] = useState<IUserWithProfile>();
  const [refreshing, setRefreshing] = useState(false);

  /* ---------- SOURCE OF TRUTH ---------- */
  const [fitnessGoals, setFitnessGoals] = useState<string[]>([]);
  const [exerciseGenre, setExerciseGenre] = useState<string[]>([]);
  const [timings, setTimings] = useState<string>("");
  const [saving, setSaving] = useState(false);

  // repmates state

  const [repmates , setRepmates]= useState<Repmate_Profile[]>([]);
  const [isEditing, setIsEditing] = useState(false);

// image states 
  const [profileImage, setProfileImage] = useState<any>(null);
  const [coverImage, setCoverImage] = useState<any>(null);

// fetching profile from server 
const fetchProfileFromAPI = async () => {
      console.log('fetching ');
  if (!user?.id) return;

  try {
    const data = await apiFetch<BackendProfileResponse>(
      `/profile/${user.id}`
    );


    console.log(data);




    const { profile } = data;
    const { userId } = profile;

   const normalizedProfile: IUserWithProfile = {
  id: userId._id,
  name: userId.name,
  username: userId.username,
  email: userId.email,
  preacherScore: userId.preacherScore,
  isVerified: userId.isVerified,
  isTrainer: userId.isTrainer,
  isAdmin: userId.isAdmin,
  streak: userId.streak,

  profileImage: profile.profileImage,
  coverImage: profile.coverImage,
  about: profile.about,

  fitnessGoals: profile.fitnessGoals ?? [],
  ambition: profile.ambition ?? [],
  exerciseGenre: profile.exerciseGenre ?? [],
  timings: profile.timings ?? "",


  repmates: userId.partner ?? [],
};


    setProfile(normalizedProfile);
    setFitnessGoals(normalizedProfile.fitnessGoals ?? []);
    setExerciseGenre(normalizedProfile.exerciseGenre ?? []);
    setTimings(normalizedProfile.timings ?? "");
    setRepmates(normalizedProfile.repmates ?? []);

    await AsyncStorage.setItem(
      "profile",
      JSON.stringify(normalizedProfile)
    );
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      logout();
      return;
    }

    if (err?.status === 404) {
      router.push("/(protected)/onboarding");
    }
  }
};


  useEffect(() => {
    const load = async () => {
      const cached = await AsyncStorage.getItem("profile");

      if (cached) {
        const parsed = JSON.parse(cached);
        setProfile(parsed);
        setFitnessGoals(parsed.fitnessGoals ?? []);
        setExerciseGenre(parsed.exerciseGenre ?? []);
        setTimings(parsed.timings ?? "");
        setRepmates(parsed.repmates ?? []);
      } else {
        await fetchProfileFromAPI();
      }
    };
    load();
  }, []);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await fetchProfileFromAPI();
    } finally {
      setRefreshing(false);
    }
  }, []);

// image picker 
  const pickImage = async (type: "profile" | "cover") => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    const file = {
      uri: asset.uri,
      name: `${type}.jpg`,
      type: "image/jpeg",
    };

    if (type === "profile") setProfileImage(file);
    if (type === "cover") setCoverImage(file);

    setIsEditing(true);
  };

// save changes 
const saveChanges = async () => {
  if (!user?.id) return;

  try {
    setSaving(true);

    const formData = new FormData();

    if (profileImage) {
      formData.append("profileImage", profileImage as any);
    }

    if (coverImage) {
      formData.append("coverImage", coverImage as any);
    }

    formData.append("fitnessGoals", JSON.stringify(fitnessGoals));
    formData.append("exerciseGenre", JSON.stringify(exerciseGenre));
    formData.append("timings", timings);
    formData.append("ambition", JSON.stringify(profile?.ambition ?? []));
    formData.append("about", profile?.about ?? "");


    const data = await apiFetch<{ profile: IUserWithProfile }>(
      `/profile/${user.id}`,
      {
        method: "PUT",
        body: formData, 
      },
      logout 
    );

    setProfile(data.profile);
    setFitnessGoals(data.profile.fitnessGoals ?? []);
    setExerciseGenre(data.profile.exerciseGenre ?? []);
    setTimings(data.profile.timings ?? "");

    await AsyncStorage.setItem(
      "profile",
      JSON.stringify(data.profile)
    );

    setProfileImage(null);
    setCoverImage(null);
    setIsEditing(false);
    showToast({type:"success" ,title:"Saved details" , message:"Successfully saved the details"})
  } catch (err: any) {
    if (err.message === "SESSION_EXPIRED") {
      // already logged out by apiFetch
      showToast({type:"error" , title:"Session expired" , message:"Login once again or restart "})
      return;
    }

    console.error("Save failed:", err);
  } finally {
    setSaving(false);
  }
};

const handleRemoveFriend = async (repmateId: string, repmateName: string) => {
  if (!user?.id) return;

  try {
    const data = await apiFetch<removeResponse>(
      "/repmate/remove",
      {
        method: "DELETE", 
        body: {
          repmateId,
          userId: user.id,
        },
      }
    );

    if (data?.success) {
      setRepmates(prev => prev.filter(m => m._id !== repmateId));

      showToast({
        type: "info",
        title: `Removed ${repmateName}`,
        message: "Successfully removed from repmates",
      });
    }
  } catch (err) {
    console.error(err);
    showToast({
      type: "error",
      title: "Failed",
      message: "Could not remove repmate",
    });
  }
};



  // logut 
  const logout = async () => {
    await AsyncStorage.multiRemove(["user", "profile" ]);
    await AsyncStorage.clear();
    // await useUser().logout();
    await clearUser();
    router.replace("/(auth)/login");
  };

  if (!user) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  const repMates =
repmates && repmates.length>0
      ? user.partner
      : DUMMY_REPMATES;


  return (
    <ScrollView
      className="flex-1 bg-zinc-950"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* bgcover */}
      <View className="relative">
        {!profile ? (
          <Shimmer height={210} />
        ) : (
          <>
            <Image
              source={{ uri: coverImage?.uri ?? profile.coverImage }}
              className="h-52 w-full"
            />
            <TouchableOpacity
              onPress={() => pickImage("cover")}
              className="absolute top-3 right-3 bg-black/60 p-2 rounded-full"
            >
              <Feather name="edit-2" size={16} color="white" />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* shimmer loaders */}
      <View className="-mt-16 px-4 flex-row items-end">
        {!profile ? (
          <Shimmer height={128} width={128} borderRadius={64} />
        ) : (
          <>
            <View className="relative">
              <Image
                source={{
                  uri: profileImage?.uri ?? profile.profileImage,
                }}
                className="h-32 w-32 rounded-full border-4 border-zinc-950"
              />
              <TouchableOpacity
                onPress={() => pickImage("profile")}
                className="absolute bottom-1 right-1 bg-black/70 p-2 rounded-full"
              >
                <Feather name="edit-2" size={14} color="white" />
              </TouchableOpacity>
            </View>

            <View className="ml-4">
              <Text className="text-white font-bartle text-md">
                {user.name}
              </Text>
              <Text className="text-zinc-200 font-ScienceGothic text-sm">
                @{user.username}
              </Text>
            </View>
          </>
        )}
      </View>

      <View className="px-4 mt-6 gap-4">
        <MileStoneCard />

        {/* goals */}
        <UserGoalCard
          fitnessGoals={fitnessGoals}
          exerciseGenre={exerciseGenre}
          onUpdateFitnessGoals={(g) => {
            setFitnessGoals(g);
            setIsEditing(true);
          }}
          onUpdateExerciseGenre={(g) => {
            setExerciseGenre(g);
            setIsEditing(true);
          }}
          onTimingChange={(t) => {
            setTimings(t);
            setIsEditing(true);
          }}

          timings={timings}
          onEditStart={() => setIsEditing(true)}
        />

        {/* repmates */}
        <Text className="text-white font-bartle text-lg mt-2">
          RepMates
        </Text>
        {repmates.map((mate: any) => (
          <RepMateCard
            key={mate._id}
            name={mate.name}
            username={mate.username}
            profileImage={mate.profile?.profileImage}
            _id={mate._id}
            preacherScore={mate.preacherScore}
            onRemove={() => handleRemoveFriend(mate._id, mate.name)}
          />
        ))}
      </View>

      {/* save */}
      {isEditing && (
        <View className="h-12 mx-4 mt-6">
          <TouchableOpacity
  disabled={saving}
  onPress={saveChanges}
  className={`h-full rounded-lg items-center justify-center ${
    saving ? "bg-green-800" : "bg-green-600"
  }`}
>
  <Text className="font-ScienceGothic text-white">
    {saving ? "Saving..." : "Save Changes"}
  </Text>
</TouchableOpacity>

        </View>
      )}

      {/* logout */}
      <View className="h-12 mx-4 mt-4">
        <TouchableOpacity
          onPress={logout}
          className="h-full rounded-lg items-center justify-center bg-white"
        >
          <Text className="font-ScienceGothic text-red-600">
            Logout
          </Text>
        </TouchableOpacity>
      </View>

      <View className="h-24" />
    </ScrollView>
  );
}
