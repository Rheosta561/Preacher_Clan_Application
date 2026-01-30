import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { MotiView } from "moti";
import ProfileCard from "../ProfileCard";
import { useUser } from "@/context/userContext";
import { apiFetch } from "@/utils/Auth/apiFetch";
import { getPreacherRank } from "@/utils/getPreacherRank";
import { useClan } from "@/constants/constants";

interface TopPreacher {
  userId: string;
  name: string;
  profileImage?: string | null;
  preacherScore: number;
  isVerified?: boolean;
  isTrainer?: boolean;
  gym?: useClan;
  timings? : string 
  fitnessGoals?: string[];
}

export default function TopPreachersSection() {
  const { user, logout } = useUser();
  const userId = user?.id;

  const [preachers, setPreachers] = useState<TopPreacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchTopPreachers = async () => {
      try {
        setLoading(true);

        const data = await apiFetch<{ profiles: TopPreacher[] }>(
          `/repmate/top-preachers/${userId}?limit=5`,
          {},
          logout
        );

        setPreachers(data.profiles || []);
      } catch (err) {
        console.error("Top preachers fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopPreachers();
  }, [userId]);

  if (loading) {
    return (
      <View className="mt-8 px-4">
        <ActivityIndicator color="#f97316" />
      </View>
    );
  }

  if (preachers.length === 0) {
    return null; // silently hide section if none
  }

  return (
    <View className="mt-8">
      {/* HEADER */}
      <View className="px-4 mb-4">
        <MotiView className="bg-orange-900/10 border border-orange-900/20 px-4 py-3 rounded-md">
          <Text className="text-orange-400 text-xs uppercase tracking-widest font-ScienceGothic">
            Elite Circle
          </Text>
          <Text className="text-white text-md font-bartle">
            Top Preachers of the Clan
          </Text>
        </MotiView>
      </View>

      {/* SCROLLABLE CARDS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 12,
        }}
      >
        {preachers.map((p) => (
          <View key={p.userId} style={{ width: 300 }}>
            <ProfileCard
              profile={{
                id: p.userId,
                image:
                  p.profileImage ||
                  "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
                name: p.name,
                age: 22, 
                goal: p.fitnessGoals?.[0] || "Train Hard",
                time: p.timings?? "",
                tags: p.fitnessGoals || [], // fitness goals 
                clan : p.gym,
                preacherRank: getPreacherRank(p.preacherScore),
                isVerified: p.isVerified ?? false,
                // hideaction: true, // no request button here
              }}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
