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


const Index = () => {

  const [gyms , setGyms ]= useState<Gym[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [split , setSplit]= useState<WorkoutSplit>();

const {challenge , setChallenge}= useChallenge();

  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

  const { user, saveUser } = useUser(); 

  const fetchFeaturedGyms = async () => {
    try {
      const res = await axios.get(`${backendUrl}/gym/featured`);
      const mapped = res.data.gyms.map((g: any) => mapBackendGymToUI(g));
      setGyms(mapped);
    } catch (error) {
      console.error("something broke ", error);
    }
  };

  // loadsplit 
  const loadSplitFromLocalStorage = async ()=>{
    const saved = await loadSplit();
    if (saved) setSplit(saved);
    // console.log('loaded split ' , saved);
    

  }

  const fetchUser = async () => {
    console.log('fetching user');
    // console.log(user )


    if (!user?.id) return;
    try {
      const res = await axios.get(`${backendUrl}/user/${user.id}`);
      console.log('fetching user status ' ,res.status);
       const userData: IUser = {
                id: res.data._id,
                name : res.data.name,
                email : res.data.email,
                username : res.data.username,
                preacherScore : res.data.preacherScore || 0  , 
                partner: res.data.partner || [],
              }
        await saveUser(userData);
    } catch (e) {
      console.log(e);
    }
  };

  // loading challenge from backend 
  

  useEffect(() => {
    fetchFeaturedGyms();
    fetchUser();
    loadSplitFromLocalStorage();

  }, []);

  useEffect(() => {
  if (!user?.id || !split) return;

  const loadChallenge = async ()=>{
    try {
      const res = await axios.post(
        `${backendUrl}/challenge/challenge-of-the-day/${user.id}`,
        { exercises: split.exercises }
      );

      setChallenge(res.data.challenge);
      console.log('loaded challenge status' , res.status);
    } catch (error) {
      console.log("challenge error", error);
    }
  };

  loadChallenge();

}, [user?.id, split]);



  

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      console.log('refreshing');
      await Promise.all([fetchFeaturedGyms(), fetchUser() , loadSplitFromLocalStorage() ]);
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
        className="flex-1 px-2 relative pt-40"
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
        <View className='bg-black rounded-lg p-1 border-dashed border-red-500'>
          <ChallengeCard
            title={challenge?.title ?? "Join Battleforge"}
            description={challenge?.description ?? "Create a split to complete challenges"}
            image={require("@/assets/images/icon.png")}
            buttonText={challenge ? "Complete challenge" : "Create split"}
            onPress={!challenge ? ()=>{
              router.push('/(protected)/split')
            } : handleChallengeNavigation}
          />
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-2"
          >
            {gyms.map(gym => (
              <GymInfoCard key={gym.gymId} gym={gym} />
            ))}
          </ScrollView>
        ) : (
          <View className="mb-2 px-4 py-3">
            <Text className="text-zinc-400 font-ScienceGothic">
              No gyms available at the moment
            </Text>
          </View>
        )}

        {/* INSIGHTS */}
        <View className='w-full h-[1px] bg-zinc-900 mt-2 mb-4' />

        <Text className='text-white text-xl font-ScienceGothic mb-2'>
          Boost Your Productivity
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-10"
        >
          {insights.map((item, index) => (
            <View key={index} className="mr-3">
              <InsightCard {...item} />
            </View>
          ))}
        </ScrollView>

      </ScrollView>
    </>
  );
};

export default Index;
