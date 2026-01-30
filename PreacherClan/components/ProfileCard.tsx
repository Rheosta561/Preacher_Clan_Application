import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { CheckCircle, DumbbellIcon } from "lucide-react-native";
import { MotiView } from "moti";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

import { apiFetch } from "@/utils/Auth/apiFetch";
import { IUser } from "@/constants/constants";
import { showToast } from "@/utils/showToast";

interface useClan {
  _id: string;
  name: string;
}

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
  hideaction?: boolean;
  clan?: useClan;
}

type RequestStatus =
  | "idle"
  | "sent"
  | "alreadySent"
  | "error"
  | "alreadyAccepted";

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
    clan,
  } = profile;

  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [requestStatus, setRequestStatus] =
    useState<RequestStatus>("idle");

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
      await apiFetch(`/requests/send/${userId}/${id}`, {
        method: "POST",
      });

      setRequestStatus("sent");

      showToast({
        type: "success",
        title: "Request Sent!",
        message: `Your message sails to ${name}'s village.`,
      });
    } catch (err: any) {
      const status = err?.status || err?.response?.status;

      if (status === 400) {
        setRequestStatus("alreadySent");
        showToast({
          type: "info",
          title: "Already Sent",
          message: "You have already sent a request",
        });
      } else if (status === 401) {
        setRequestStatus("alreadyAccepted");
        showToast({
          type: "info",
          title: "Already RepMate",
          message: "You are already connected",
        });
      } else {
        setRequestStatus("error");
        showToast({
          type: "error",
          title: "Request Failed",
          message: err?.message || "Something went wrong",
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
    requestStatus === "alreadySent" ||
    requestStatus === "alreadyAccepted";

  return (
    <MotiView
      from={{ opacity: 0, translateY: 40 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 400 }}
      className="w-full bg-red-600 rounded-lg border-2 border-zinc-800 overflow-hidden"
    >
      {/* ---------- IMAGE ---------- */}
      <View className="relative">
        <Image
          source={{ uri: image }}
          className="w-full h-64"
          resizeMode="cover"
        />

        {/* 🌑 DARK CINEMATIC OVERLAY (ONLY ADDITION) */}
        <LinearGradient
          colors={[
            "rgba(0,0,0,0.15)",
            "rgba(0,0,0,0.45)",
            "rgba(0,0,0,0.8)",
          ]}
          className="absolute inset-0"
        />

        {isVerified && (
          <View className="absolute bottom-2 left-2 bg-zinc-50 px-2 py-1 rounded flex-row items-center">
            <CheckCircle size={14} color="black" />
            <Text className="ml-1 text-black text-xs font-semibold font-ScienceGothic">
              Verified
            </Text>
          </View>
        )}

        <View className="absolute bottom-2 right-2 bg-zinc-950 px-2 py-1 rounded-md flex-row items-center">
          <DumbbellIcon size={14} color="white" />
          <Text className="ml-1 text-white text-xs font-semibold font-ScienceGothic">
            {clan?.name ?? "The Preacher Clan"}
          </Text>
        </View>

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
        <Text className="text-lg font-semibold font-bartle text-black">
          {name}, {age}
        </Text>

        <Text className="text-zinc-950 text-sm mt-1 font-ScienceGothic">
          Goal: {goal}
        </Text>

        <Text className="text-zinc-950 text-sm font-ScienceGothic">
          Preferred Time: {time}
        </Text>

        {/* TAGS */}
        <View className="flex-row flex-wrap gap-2 mt-3">
          {tags.map((tag, idx) => (
            <View key={idx} className="bg-zinc-900 px-2 py-1 rounded-md">
              <Text className="text-xs text-zinc-300 capitalize font-ScienceGothic">
                {tag}
              </Text>
            </View>
          ))}
        </View>

        {/* ACTION BUTTON */}
        {!profile.hideaction && (
          <TouchableOpacity
            disabled={isDisabled}
            onPress={sendRequestHandler}
            className={`mt-4 w-full py-2 rounded-md ${
              isDisabled ? "bg-zinc-50" : "bg-zinc-950"
            }`}
          >
            <Text
              className={`text-center text-sm font-ScienceGothic ${
                isDisabled ? "text-zinc-900" : "text-zinc-50"
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
                : requestStatus === "alreadyAccepted"
                ? "Already A Repmate"
                : "Send Request"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </MotiView>
  );
};

export default ProfileCard;
