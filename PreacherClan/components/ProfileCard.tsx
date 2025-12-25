import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { CheckCircle } from "lucide-react-native";
import { MotiView } from "moti";
import axios, { AxiosError } from "axios";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { IUser } from "@/constants/constants";

interface Profile {
  id: string;
  image: string;
  name: string;
  age: number;
  goal: string;
  time: string;
  tags: string[];
  preacherRank?: string;
  isVerified: boolean;
  onSendRequest?: () => void;
  hideaction? : boolean
  

}



type RequestStatus = "idle" | "sent" | "alreadySent" | "error";

const ProfileCard = ({ profile }: { profile: Profile }) => {
  const {
    id,
    image,
    name,
    age,
    goal,
    time,
    tags,
    preacherRank,
    isVerified,
    onSendRequest,
  } = profile;

  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [requestStatus, setRequestStatus] =
    useState<RequestStatus>("idle");

  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

  /* ---------- LOAD USER ---------- */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (!storedUser) return;

        const parsed: IUser = JSON.parse(storedUser);
        setUserId(parsed.id || (parsed as any)._id);
      } catch (err) {
        console.error("AsyncStorage user load failed", err);
      }
    };

    loadUser();
  }, []);

  const isSelf = Boolean(userId && id && userId === id);

  /* ---------- SEND REQUEST ---------- */
  const handleRequest = async () => {
    if (!userId || loading) return;

    setLoading(true);

    try {
      await axios.post(
        `${backendUrl}/requests/send/${userId}/${id}`
      );

      setRequestStatus("sent");

      Toast.show({
        type: "success",
        text1: "Request Sent!",
        text2: `Your message sails to ${name}'s village.`,
      });
    } catch (err) {
      const axiosError = err as AxiosError;

      if (axiosError.response?.status === 400) {
        setRequestStatus("alreadySent");

        Toast.show({
          type: "info",
          text1: "Already Sent",
          text2: "You have already sent a request",
        });
      } else {
        setRequestStatus("error");

        Toast.show({
          type: "error",
          text1: "Request Failed",
          text2:
            (axiosError.response?.data as any)?.message ||
            "Something went wrong",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const sendRequestHandler =
    typeof onSendRequest === "function"
      ? onSendRequest
      : handleRequest;

  const isDisabled =
    isSelf ||
    loading ||
    requestStatus === "sent" ||
    requestStatus === "alreadySent";

  return (
    <MotiView
      from={{ opacity: 0, translateY: 40 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 400 }}
      className="w-full bg-red-600 rounded-lg border border-zinc-800 overflow-hidden"
    >
      {/* ---------- IMAGE ---------- */}
      <View className="relative">
        <Image
          source={{ uri: image }}
          className="w-full h-64"
          resizeMode="cover"
        />

        {isVerified && (
          <View className="absolute bottom-2 left-2 bg-zinc-50 px-2 py-1 rounded flex-row items-center">
            <CheckCircle size={14} color="black" />
            <Text className="ml-1 text-black text-xs font-semibold font-ScienceGothic">
              Verified
            </Text>
          </View>
        )}

        {preacherRank && (
          <View className="absolute top-2 right-2 bg-yellow-500 px-2 py-1 rounded">
            <Text className="text-black text-xs font-semibold font-ScienceGothic">
              {preacherRank}
            </Text>
          </View>
        )}
      </View>

      {/* ---------- INFO ---------- */}
      <View className="p-4">
        <Text className="text-lg font-semibold font-bartle  text-black">
          {name}, {age}
        </Text>

        <Text className="text-zinc-950 text-sm mt-1 font-ScienceGothic">
          Goal: {goal}
        </Text>

        <Text className="text-zinc-950 text-sm font-ScienceGothic">
          Preferred Time: {time}
        </Text>

        {/* ---------- TAGS ---------- */}
        <View className="flex-row flex-wrap gap-2 mt-3">
          {tags.map((tag, idx) => (
            <View key={idx} className="bg-zinc-900 px-2 py-1 rounded-md">
              <Text className="text-xs text-zinc-300 capitalize font-ScienceGothic">
                {tag}
              </Text>
            </View>
          ))}
        </View>

        {/* ---------- ACTION BUTTON ---------- */}
        {!profile.hideaction &&  <TouchableOpacity
          disabled={isDisabled}
          onPress={sendRequestHandler}
          className={`mt-4 w-full py-2 rounded-md ${
            isDisabled
              ? "bg-zinc-800 opacity-40"
              : "bg-zinc-950"
          }`}
        >
          <Text
            className={`text-center text-sm font-ScienceGothic ${
              isDisabled
                ? "text-zinc-500"
                : "text-zinc-50"
            }`}
          >
            {isSelf
              ? "You"
              : loading
              ? "Sending..."
              : requestStatus === "sent"
              ? "Sent"
              : requestStatus === "alreadySent"
              ? "Already Sent"
              : requestStatus === "error"
              ? "Retry"
              : "Send Request"}
          </Text>
        </TouchableOpacity> }
       
      </View>
    </MotiView>
  );
};

export default ProfileCard;
