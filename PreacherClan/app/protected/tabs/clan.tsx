import { MapPin } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TextInput,
  View,
  RefreshControl,
} from "react-native";

import Navbar from "@/components/Utility/Navbar";
import GymCapacity from "@/components/GymComponents/GymCapacity";
import InsightCard from "@/components/GymComponents/InsightCard";
import StreakMarker from "@/components/GymComponents/StreakMaker";
import ProfileCard from "@/components/ProfileCard";
import ClanLeaderCard from "@/components/GymComponents/ClanLeaderCard";
import TrainerCard from "@/components/GymComponents/TrainerCard";
import MembershipDetailCard from "@/components/GymComponents/MembershipDetailCard";
import MembershipInfoModal from "@/components/GymComponents/MembershipInfoModal";
import { useLocalSearchParams, useRouter } from "expo-router";
import { showToast } from "@/utils/showToast";


import { apiFetch } from "@/utils/Auth/apiFetch";
import { useUser } from "@/context/userContext";
import {
  TrainerCardProps,
  TrainerStatus,
} from "@/constants/trainer";
import AnnouncementsSection from "@/components/GymComponents/AnnouncementSection";

const { width } = Dimensions.get("window");

/* ================= UI MODELS ================= */

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



// normalising profiles 
const normalizeGymMember = (user: any): Profile => ({
  id: user._id,
  name: user.name,
  image: user.profile?.profileImage ?? "",
  age: 0,
  goal: user.profile?.fitnessGoals?.[0] ?? "Train Hard",
  time: user.profile?.timings ?? "—",
  tags: user.profile?.fitnessGoals ?? [], 
  preacherRank: `PR: ${user.preacherScore ?? 0}`,
  isVerified: user.isVerified ?? false,
});

// trainer normalised
const normalizeTrainer = (user: any): TrainerCardProps & {
  status?: TrainerStatus;
} => ({
  profile: {
    id: user._id,
    name: user.name,
    image: user.profile?.profileImage ?? "",
    age: user.age ?? 0,
    goal: user.profile?.fitnessGoals?.[0] ?? "Personal Training",
    time: user.profile?.timings ?? "—",
    tags: user.profile?.fitnessGoals ?? [], 
    preacherRank: "Trainer",
    isVerified: user.isVerified ?? false,
  },
  status: "idle",
});

// ui

const Clan: React.FC = () => {
  const { user } = useUser();
  const gymId = user?.gym?.id;
const { qr } = useLocalSearchParams<{ qr?: string }>();
const router = useRouter();
const streakCalledRef = useRef(false);

  const scrollRef = useRef<ScrollView>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);


  const[city , setcity] = useState<string>("");

  const [members, setMembers] = useState<Profile[]>([]);
  const [leader , setLeader ]= useState<Profile>();
  const [trainers, setTrainers] = useState<
    (TrainerCardProps & { status?: TrainerStatus })[]
  >([]);

// gymdata
    const fetchGym = async () => {
      try {
        const data = await apiFetch<any>(`/gym/gym/${gymId}`);
        const gym = data.gym;
        console.log('gym daata ' , gym?.owner);

        setMembers((gym.members ?? []).map(normalizeGymMember));
        setcity(gym?.address?.city ?? "");

        setTrainers((gym.trainers ?? []).map(normalizeTrainer));
        if(gym.owner){
          setLeader(normalizeGymMember(gym.owner));
        }
      } catch (err) {
        console.error("Failed to fetch gym data", err);
      }
    };
    const markStreakFromQR = async (encryptedQR: string) => {
  try {
    await apiFetch("/gym/streak/scan", {
      method: "POST",
      body: {
        encrypted: encryptedQR,
        userId : user?.id
      },
    });

    showToast({
      type: "success",
      title: "Streak Marked",
      message: "Your Rune streak has been updated",
    });
  } catch (err: any) {
    showToast({
      type: "error",
      title: "Streak Failed",
      message:
        err?.message || "Unable to mark streak",
    });
  }
};

  useEffect(() => {
    if (!gymId) return;



    fetchGym();
  }, [gymId]);

  useEffect(() => {
  // wait until user + gym are ready
  if (!user || !gymId) return;

  // no QR normal clan open
  if (!qr) return;
  if (!gymId && qr) {
  showToast({
    type: "info",
    title: "Clan Locked",
    message: "Join a gym to mark your streak",
  });
  return ; 
}

  // prevent duplicate calls
  if (streakCalledRef.current) return;

  streakCalledRef.current = true;
  markStreakFromQR(qr);
}, [qr, user, gymId]);




// search filter
  const filteredMembers = members.filter((m) =>
    `${m.name} ${m.goal} ${m.preacherRank} ${m.tags.join(" ")}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
const onRefresh = async () => {
  setRefreshing(true);
  await fetchGym();
  setRefreshing(false);
};

  const now = new Date();
  const day = now.toLocaleDateString("en-US", { weekday: "long" });
  const date = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <Navbar />

      <ScrollView className="flex-1 bg-zinc-950 px-3 mt-36"
       refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor="black"          // iOS spinner
      colors={["black"]}         // Android spinner
    />
  }
      >

        <Text className="text-white text-2xl font-bartle mt-2">
          {user?.gym?.name ?? "Gym"}
        </Text>

        <View className="flex-row items-center gap-2 mt-1">
          <MapPin size={16} color="#f87171" />
          <Text className="text-zinc-400 font-ScienceGothic">
            {city}
          </Text>
        </View>

{/* cards */}
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
          <AnnouncementsSection/>
          <MembershipDetailCard
  membershipName="Gold Membership"
  startDate="2026-01-01"
  endDate="2026-03-31"
  onRenew={() => console.log("Renew pressed")}
  onInfoPress={() => setShowInfo(true)}
/>

<MembershipInfoModal
  visible={showInfo}
  onClose={() => setShowInfo(false)}
/>
        </View>

{/* members */}
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
          className="mt-4"
        >
          <View className="flex-row px-2">
            {filteredMembers.map((member) => (
              <View key={member.id} className="mr-2">
                <ProfileCard profile={member} />
              </View>
            ))}
          </View>
        </ScrollView>

{/* clan leader  */}
       {leader && (
  <>
    <Text className="text-white text-xl font-semibold font-ScienceGothic mt-6">
      Clan Leader
    </Text>

    <ClanLeaderCard
      profile={leader}
      clanName={user?.gym?.name ?? "Clan"}
    />
  </>
)}


        {/* ---------- TRAINERS ---------- */}
        <Text className="text-white text-xl font-semibold font-ScienceGothic mt-8">
          Trainers
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4 mb-40"
        >
          {trainers.length>0 ?  (<View className="flex-row px-2">
            {trainers.map((trainer) => (
              <View key={trainer.profile.id} className="mr-3 w-[320px]">
                <TrainerCard
                  profile={trainer.profile}
                  status={trainer.status}
                  onBookTrainer={async (trainerId) => {
                    setTrainers((prev) =>
                      prev.map((t) =>
                        t.profile.id === trainerId
                          ? { ...t, status: "booked" }
                          : t
                      )
                    );
                  }}
                />
              </View>
            ))}
          </View>) : <Text className="text-zinc-200 text-center w-full mx-auto font-ScienceGothic">
            No Trainers Appointed till Now
          </Text> }

        
        </ScrollView>
      </ScrollView>
    </>
  );
};

export default Clan;
