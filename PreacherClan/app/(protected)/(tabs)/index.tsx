import { View, Text, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Utility/Navbar'
import ChallengeCard from '@/components/Utility/ChallengeCard'
import SearchBox from '@/components/Utility/SearchBox'
import GymInfoCard from '@/components/GymComponents/GymInfoCard'
import InsightCard from "@/components/Utility/InsightCard";
import SplitPromo from '@/components/Split/SplitPromo'
import { Gym , mapBackendGymToUI } from '@/constants/gyms'
import axios from 'axios'
import { useUser } from '@/context/userContext'
import { IUser } from '@/constants/constants'
import { router } from 'expo-router'
import { loadSplit } from '@/utils/splitStorage'
import { WorkoutSplit } from '@/constants/split'
import { ChallengeType } from '@/constants/challenge'
import { useChallenge } from '@/context/ChallengeContext'
import TopPreachersSection from '@/components/Utility/TopPreachersOfTheClanSection'
import ChallengeCardShimmer from '@/components/Utility/ChallengeCardShimmer'
import GymCardShimmer from '@/components/Utility/GymCardShimmer'
import { apiFetch } from '@/utils/Auth/apiFetch'
import { getDistanceInKm } from "@/utils/distance";
import AffiliatePromoCard from '@/components/Utility/AffiliatePromoCard'
import { Linking } from "react-native";




const Index = () => {

  const [gyms , setGyms ]= useState<Gym[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [split , setSplit]= useState<WorkoutSplit>();
  const [challengeLoading, setChallengeLoading] = useState(false)


const {challenge , setChallenge}= useChallenge();

  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

  const { user, saveUser , logout } = useUser(); 

 const fetchFeaturedGyms = async () => {
  try {
    const data = await apiFetch<{ gyms: any[] }>(
      `/gym/featured`,
      {},
      async () => router.replace('/(auth)/login')
    );

   const mapped = data.gyms.map((g: any) => {
  const gymUI = mapBackendGymToUI(g);

  const userCoords = user?.location?.coordinates;
  const gymLat = g.address?.lattitude;
  const gymLng = g.address?.longitude;

  if (
    userCoords &&
    typeof gymLat === "number" &&
    typeof gymLng === "number"
  ) {
    const distanceKm = getDistanceInKm(
      userCoords[1], // user latitude
      userCoords[0], // user longitude
      gymLat,
      gymLng
    );

    return {
      ...gymUI,
      distanceKm,
    };
  }

  return gymUI;
});


    setGyms(mapped);
  } catch (error) {
    console.error("fetchFeaturedGyms error", error);
  }
};


  // loadsplit 
  const loadSplitFromLocalStorage = async ()=>{
    const saved = await loadSplit();
    if (saved) setSplit(saved);
    // console.log('loaded split ' , saved);
    

  }

 const fetchUser = async () => {
  if (!user?.id) return;

  try {
    const data = await apiFetch<any>(
      `/user/${user.id}`,
      {},
      logout
    );




    const userData: IUser = {
      id: data._id,
      name: data.name,
      email: data.email,
      username: data.username,
      preacherScore: data.preacherScore || 0,
      partner: data.partner || [],
      gym : data?.gym ,
      location : data?.location ,
      onboardingCompleted : data.onboardingCompleted ,
      
    };

    await saveUser(userData);
  } catch (e) {
    console.log("fetchUser error", e);
  }
};


  // loading challenge from backend 
  
const loadChallenge = async () => {
    try {
      if (!user?.id || !split) return;
      setChallengeLoading(true)
      const data = await apiFetch<{ challenge: ChallengeType }>(
        `/challenge/challenge-of-the-day/${user?.id}`,
        {
          method: "POST",
          body: { exercises: split?.exercises },
        },
        logout
      );

      setChallenge(data.challenge);
    } catch (error) {
      console.log("challenge error", error);
      setChallenge(null)
    }finally{
      setChallengeLoading(false);
    }
};
  useEffect(() => {
    fetchFeaturedGyms();
    fetchUser();
    loadSplitFromLocalStorage();

  }, []);



useEffect(() => {
  if (!user?.id || !split) return;
  loadChallenge();
}, [user?.id, split]);




  

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      console.log('refreshing');
      await Promise.all([fetchFeaturedGyms(), fetchUser() , loadSplitFromLocalStorage(), loadSplit() , loadChallenge() ]);
    } finally {
      setRefreshing(false);
    }
  };

  const handleChallengeNavigation = ()=>{
    router.push('/(protected)/challenge');
  }
  const insights = [
    { title: "Fix Your Squat", insight: "Learn proper squat mechanics to avoid injury and grow faster.", footer: "Training Video", videoId: "YaXPRqUwItQ" },
    { title: "Perfect Pushups", insight: "Master the perfect pushup form with this expert guide.", footer: "Form Coaching", videoId: "IODxDxX7oi4" },
    { title: "Warmup Routine", insight: "A quick 5-minute warmup to boost performance.", footer: "Daily Prep", videoId: "VHyGqsPOUHs" },
  ];

  return (
    <>
      <Navbar />

      <ScrollView
        className="flex-1 px-2 relative pt-40 pb-40"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
            progressViewOffset={100}
          />
        }
      >

        {/* CHALLENGE */}
<View className="bg-black rounded-lg p-1 border-dashed border-red-500">
  {challengeLoading ? (
    <ChallengeCardShimmer />
  ) : challenge ? (
    
    <ChallengeCard
      title={challenge.title}
      description={challenge.description}
      image={require("@/assets/images/icon.png")}
      buttonText="Complete challenge"
      onPress={handleChallengeNavigation}
    />
  ) : (
   
    <ChallengeCard
      title="Create Your Battle Split"
      description="Create a workout split to unlock daily clan challenges."
      image={require("@/assets/images/icon.png")}
      buttonText="Create Split"
      onPress={() => router.push('/(protected)/split')}
    />
  )}
</View>



        <View className='w-full h-[1px] bg-zinc-900 mt-4' />

        {/* JOIN THE CLAN */}
        <Text className='text-white text-xl font-ScienceGothic mt-4'>Join The Clan</Text>
        <Text className='text-zinc-400 text-sm font-ScienceGothic mb-2'>
          Connect with fellow fitness enthusiasts and grow together.
        </Text>

        <SearchBox />

        <View className='w-full h-[1px] bg-zinc-900 mt-4 mb-4' />

        <View className='p-2 w-full'>
          <SplitPromo/>
        </View>

        <View className='w-full h-[1px] bg-zinc-900 mt-4 mb-4' />

        {/* TOP GYMS */}
        <Text className='text-white text-xl font-ScienceGothic mb-2'>
          Top Gyms Of The Town
        </Text>

      {gyms.length > 0 ? (
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {gyms.map(gym => (
      <GymInfoCard key={gym.gymId} gym={gym} />
    ))}
  </ScrollView>
) : (
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {[1, 2, 3].map(i => (
      <GymCardShimmer key={i} />
    ))}
  </ScrollView>
)}


        {/* INSIGHTS */}
        <View className='w-full h-[1px] bg-zinc-900 mt-2 mb-4' />

        <Text className='text-white text-xl font-ScienceGothic mb-2'>
          Boost Your Productivity
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className=""
        >
          {insights.map((item, index) => (
            <View key={index} className="mr-3">
              <InsightCard {...item} />
            </View>
          ))}
        </ScrollView>
        
        <TopPreachersSection />

<View className="w-full h-[1px] bg-zinc-900 mt-6 mb-4" />

{/* 🔥 AFFILIATE DEALS */}
<Text className="text-white text-xl font-ScienceGothic mb-2">
  Gear Recommended by the Clan
</Text>

<Text className="text-zinc-400 text-sm font-ScienceGothic mb-3">
  Tested gear. Warrior-approved deals.
</Text>

<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={{ paddingHorizontal: 4 }}
>
  <View className="mr-3">
    <AffiliatePromoCard
      title="Rogue Olympic Barbell"
      brand="Rogue Fitness"
      tags={["15% OFF", "Limited Time"]}
      youtubeVideoId="Yko3GMseY40"
      onPress={() =>
        Linking.openURL("https://www.roguefitness.com")
      }
    />
  </View>

  <View className="mr-3">
    <AffiliatePromoCard
      title="Preacher Wrist Wraps"
      brand="Preacher Gear"
      tags={["Special Discount"]}
      imageUrl="https://images.unsplash.com/photo-1599058917212-d750089bc07e"
      ctaText="Buy Now"
      onPress={() =>
        Linking.openURL("https://preacherclan.in/store")
      }
    />
  </View>
</ScrollView>

<View className="mt-32 h-10 w-full" />


      </ScrollView>
    </>
  );
};

export default Index;
