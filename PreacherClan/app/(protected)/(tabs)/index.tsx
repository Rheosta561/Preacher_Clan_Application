import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import Navbar from '@/components/Utility/Navbar'
import ChallengeCard from '@/components/Utility/ChallengeCard'
import SearchBox from '@/components/Utility/SearchBox'
import GymInfoCard from '@/components/GymComponents/GymInfoCard'


import InsightCard from "@/components/Utility/InsightCard";
import SplitPromo from '@/components/Split/SplitPromo'

const index = () => {

  const gym = {
    gymId: "gym101",
    name: "Iron Paradise Fitness",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&auto=format&fit=crop&q=60",
    location: "Rohini Sector 10",
    distance: "2.1 km",
    trainers: 8,
    equipments: ["Dumbbells", "Bench Press", "Treadmill", "Leg Press"],
    fees: 1500,
    rating: 4.8,
    featured: true,
  };


  const insights = [
    {
      title: "Fix Your Squat",
      insight: "Learn proper squat mechanics to avoid injury and grow faster.",
      footer: "Training Video",
      videoId: "YaXPRqUwItQ",
    },
    {
      title: "Perfect Pushups",
      insight: "Master the perfect pushup form with this expert guide.",
      footer: "Form Coaching",
      videoId: "IODxDxX7oi4",
    },
    {
      title: "Warmup Routine",
      insight: "A quick 5-minute warmup to boost performance.",
      footer: "Daily Prep",
      videoId: "VHyGqsPOUHs",
    },
  ];

  return (
    <>
      <Navbar />

      <ScrollView
        className="flex-1 px-2 relative pt-36"
        showsVerticalScrollIndicator={false}
      >
        
        {/* CHALLENGE BANNER */}
        <View className='bg-[#000000] rounded-lg text-zinc-950 p-1 border-dashed  border-red-500'>
          <ChallengeCard
  title="Challenge of The Day"
  description="Join the 30-day fitness challenge and transform yourself."
  image={require("@/assets/images/icon.png")}
  buttonText="Start Challenge"
  onPress={() => console.log("Challenge Started!")}
/>


        </View>

        <View className='w-full h-[1px] bg-zinc-900 mt-4' />

        {/* JOIN THE CLAN */}
        <View>
          <Text className='text-white text-xl font-ScienceGothic mt-4'>Join The Clan</Text>
          <Text className='text-zinc-400 font-medium font-ScienceGothic text-sm mb-2'>
            Connect with fellow fitness enthusiasts and grow together.
          </Text>
          <SearchBox />
        </View>

        <View className='w-full h-[1px] bg-zinc-900 mt-4 mb-4' />
        <View className='p-2 w-full'> 
          <SplitPromo/>
        </View>
         <View className='w-full h-[1px] bg-zinc-900 mt-4 mb-4' />

        {/* TOP GYMS */}
        <Text className='text-white text-xl font-ScienceGothic  mb-2'>Top Gyms Of The Town</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className='mb-2'>
          <GymInfoCard gym={gym} />
        </ScrollView>

        {/* youtube vidoe cards */}
        <View className='w-full h-[1px] bg-zinc-900 mt-2 mb-4' />
        <Text className='text-white text-xl font-ScienceGothic  mb-2'>
          Boost Your Productivity
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-10">
          {insights.map((item, index) => (
            <View key={index} className="mr-3">
              <InsightCard
                title={item.title}
                insight={item.insight}
                footer={item.footer}
                videoId={item.videoId}
              />
            </View>
          ))}
        </ScrollView>
         <View className='w-full h-[1px] bg-zinc-900 mt-2 mb-52' />


      </ScrollView>
    </>
  );
};

export default index;
