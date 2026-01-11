import React from "react";
import { View, Text } from "react-native";
import { Crown } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";

import ProfileCard from "../ProfileCard";

interface ClanLeaderCardProps {
  profile: {
    id: string;
    image: string;
    name: string;
    age: number;
    goal: string;
    time: string;
    tags: string[];
    preacherRank?: string;
    isVerified: boolean;
    hideaction?: boolean;
  };
  clanName: string;
}

const ClanLeaderCard = ({ profile, clanName }: ClanLeaderCardProps) => {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 500 }}
      className="relative"
    >
      {/* LEADER AURA */}
      <LinearGradient
        colors={["rgba(255,215,0,0.25)", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="absolute inset-0 rounded-xl z-0"
      />

      {/* CROWN BADGE */}
      <View className="absolute top-3 left-3 z-20 flex-row items-center bg-yellow-500 px-2 py-1 rounded-md">
        <Crown size={14} color="black" />
        <Text className="ml-1 text-xs font-bartle text-black ">
          Clan Leader
        </Text>
      </View>

      {/*  CLAN NAME */}
      <View className="absolute bottom-3 right-2 z-20 bg-zinc-950 px-3 py-1 rounded-md border border-zinc-700">
        <Text className="text-xs tracking-widest text-zinc-100 font-ScienceGothic uppercase">
          {clanName}
        </Text>
      </View>

      {/* PROFILE CARD */}
      <View className="z-10">
        <ProfileCard
          profile={{
            ...profile,
            hideaction: true, 
          }}
        />
      </View>
    </MotiView>
  );
};

export default ClanLeaderCard;
