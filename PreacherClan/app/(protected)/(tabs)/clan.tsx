import { MapPin } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, ScrollView, Text, TextInput, View } from "react-native";

import GymCapacity from "@/components/GymComponents/GymCapacity";
import InsightCard from "@/components/GymComponents/InsightCard";
import StreakMarker from "@/components/GymComponents/StreakMaker";
import ProfileCard from "@/components/ProfileCard";
import Navbar from "@/components/Utility/Navbar";
import ClanLeaderCard from "@/components/GymComponents/ClanLeaderCard";
import { TrainerCardProps } from "@/constants/trainer";
import { TrainerStatus } from "@/constants/trainer";
import TrainerCard from "@/components/GymComponents/TrainerCard";


const { width } = Dimensions.get("window");


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
}

const Clan: React.FC = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState<Profile[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
const [trainers, setTrainers] = useState<
  (TrainerCardProps["profile"] & { status?: TrainerStatus })[]
>([]);






  useEffect(() => {
    setMembers([
      {
        id: "1",
        name: "Aarav Singh",
        image: "https://i.pinimg.com/736x/b6/6e/2a/b66e2a27f71309a4731ffedd42719ef0.jpg",
        goal: "Build Muscle",
        time: "6:00 AM",
        tags: ["hypertrophy", "discipline"],
        preacherRank: "PR: 820",
        isVerified: true,
        age: 0,
      },
      {
        id: "2",
        name: "Jane Smith",
        image: "./",
        goal: "Weight Loss",
        time: "7:30 AM",
        tags: ["cardio", "HIIT"],
        preacherRank: "PR: 610",
        isVerified: false,
        age: 0,
      },
    ]);
    setTrainers([
  {
    id: "t1",
    name: "Ragnar Holt",
    image: "https://i.pinimg.com/736x/0f/2f/42/0f2f42d3b4b7c5a8f8c0c41fd9b1bb8c.jpg",
    age: 32,
    goal: "Strength & Conditioning",
    time: "5:30 AM",
    tags: ["strength", "powerlifting"],
    preacherRank: "Elite Trainer",
    isVerified: true,
    status: "idle",
  },
  {
    id: "t2",
    name: "Eivor Kane",
    image: "https://i.pinimg.com/736x/8d/1c/56/8d1c56fae1ed7d7dbe6a7ef7fd7cbad9.jpg",
    age: 29,
    goal: "Fat Loss & Mobility",
    time: "7:00 AM",
    tags: ["mobility", "fat-loss"],
    preacherRank: "Master Trainer",
    isVerified: true,
    status: "booked",
  },
]);

  }, []);

  const filteredMembers = members.filter((m) =>
    `${m.name} ${m.goal} ${m.preacherRank} ${m.tags?.join(" ")}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const now = new Date();
  const day = now.toLocaleDateString("en-US", { weekday: "long" });
  const date = now.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <>
    <Navbar/>
     <ScrollView className="flex-1 bg-zinc-950 px-3 mt-36">
      {/* Header */}
      <Text className="text-white text-2xl font-bartle mt-2">
        Preacher Clan Gym
      </Text>

      <View className="flex-row items-center gap-2 mt-1">
        <MapPin size={16} color="#f87171" />
        <Text className="text-zinc-400 font-ScienceGothic">Delhi, India</Text>
      </View>

      {/* Cards */}
      <View className="mt-4 gap-3">
        <GymCapacity
          day={day}
          date={date}
          preachersCount={members.length}
          capacityPercent={20}
          maxCapacity={100}
        />

        <InsightCard
          title="Daily Insight"
          insight="Consistency is what turns average into excellence."
          footer="– Unknown"
        />

        <StreakMarker />
      </View>

      {/* Members */}
      <Text className="text-white text-xl font-semibold font-ScienceGothic mt-6">
        Clan Members
      </Text>

      <TextInput
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Search members..."
        placeholderTextColor="#71717a"
        className="mt-3 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white"
      />

    <ScrollView
  ref={scrollRef}
  horizontal
  pagingEnabled
  showsHorizontalScrollIndicator={false}
  onScroll={(e) =>
    setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / width))
  }
  className="mt-4"
>
  <View className="flex-row px-2">
    {filteredMembers.map((member, index) => (
      <View key={member.id} className="mr-2">
        <ProfileCard profile={member} />
      </View>
    ))}
  </View>

 
</ScrollView>
 <View className="w-full  ">
    <Text className="text-white text-xl font-semibold font-ScienceGothic mt-6">
        Clan Leader
      </Text>
      {members.length > 0 && <ClanLeaderCard profile={members[0]} clanName="PreacherClan" />}
     
  </View>
  <Text className="text-white text-xl font-semibold font-ScienceGothic mt-8">
  Trainers
</Text>

<ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4 mb-40">
  <View className="flex-row px-2">
    {trainers.map((trainer) => (
      <View key={trainer.id} className="mr-3 w-[320px]">
        <TrainerCard
          profile={trainer}
          status={trainer.status}
          onBookTrainer={async (trainerId) => {
            setTrainers((prev) =>
              prev.map((t) =>
                t.id === trainerId
                  ? { ...t, status: "booked" }
                  : t
              )
            );
          }}
        />
      </View>
    ))}
  </View>
</ScrollView>


    </ScrollView>
    </>
   
  );
};

export default Clan;
