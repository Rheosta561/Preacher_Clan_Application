import { MapPin } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, ScrollView, Text, TextInput, View } from "react-native";

import GymCapacity from "@/components/GymComponents/GymCapacity";
import InsightCard from "@/components/GymComponents/InsightCard";
import StreakMarker from "@/components/GymComponents/StreakMaker";
import ProfileCard from "@/components/ProfileCard";
import Navbar from "@/components/Utility/Navbar";

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


  useEffect(() => {
    setMembers([
      {
        id: "1",
        name: "Aarav Singh",
        image: "",
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
        image: "",
        goal: "Weight Loss",
        time: "7:30 AM",
        tags: ["cardio", "HIIT"],
        preacherRank: "PR: 610",
        isVerified: false,
        age: 0,
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

    </ScrollView>
    </>
   
  );
};

export default Clan;
