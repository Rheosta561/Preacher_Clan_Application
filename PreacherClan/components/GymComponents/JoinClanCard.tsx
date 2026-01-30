import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

interface JoinClanCardProps {
  gym: {
    name?: string;
    profileImage?: string;
    rating?: number;
    location?: string;
    phone?: string;
  };
}

export default function JoinClanCard({ gym }: JoinClanCardProps) {
  return (
    <View className="relative h-44 w-full rounded-lg overflow-hidden">
      {/* Background Image */}
      {gym?.profileImage ? (
        <Image
          source={{ uri: gym.profileImage }}
          className="absolute inset-0 h-full w-full"
          resizeMode="cover"
        />
      ) : (
        <View className="absolute inset-0 bg-zinc-800" />
      )}

      {/* Dark Overlay */}
      <View className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <View className="absolute inset-0 p-4 flex justify-between">
        {/* Top Row */}
        <View className="flex-row justify-between items-start">
          <Text className="text-green-400 text-sm font-ScienceGothic">
            {gym?.rating ?? "4.8"} ★
          </Text>

          <View className="items-end">
            <Text className="text-white text-xs font-semibold font-ScienceGothic">
              Certified
            </Text>
            <TouchableOpacity>
              <Text className="text-zinc-300 text-xs underline font-ScienceGothic">
                Learn More
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Info */}
        <View>
          <Text className="text-white text-lg font-semibold font-bartle">
            {gym?.name ?? "Unknown Gym"}
          </Text>

          <Text className="text-zinc-200 text-xs font-ScienceGothic">
            {gym?.location ?? "India"}
          </Text>

          <Text className="text-zinc-200 text-xs font-ScienceGothic">
            {gym?.phone ?? "+91 73030 36689"}
          </Text>
        </View>
      </View>
    </View>
  );
}
