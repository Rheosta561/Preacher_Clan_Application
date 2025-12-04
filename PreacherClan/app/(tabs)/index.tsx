import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import Navbar from '@/components/Utility/Navbar'
import ChallengeCard from '@/components/Utility/ChallengeCard'
import SearchBox from '@/components/Utility/SearchBox'
import GymInfoCard from '@/components/GymComponents/GymInfoCard'

const index = () => {
  const gym = {
    gymId: "gym101",
    name: "Iron Paradise Fitness",
    image: "https://i.imgur.com/nQJYkKQ.jpeg",
    location: "Rohini Sector 10",
    distance: "2.1 km",
    trainers: 8,
    equipments: ["Dumbbells", "Bench Press", "Treadmill", "Leg Press"],
    fees: 1500,
    rating: 4.8,
    featured: true,
  };
  return (
    <>
    <Navbar/>
     <ScrollView
        className="flex-1 px-2 relative pt-36 "
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View className='bg-[#f4f2f2] rounded-lg text-zinc-950 p-2 '> 

          <View>
            <ChallengeCard/>
          </View>
        </View>

        <View className='w-full h-[1px] bg-zinc-400 mt-4'>

        </View>
        <View>
          <Text className='text-white text-xl font-semibold mt-4 mb- ' > Join The Clan </Text>
          <Text className='text-zinc-400 text-sm mb-2 ' > Connect with fellow fitness enthusiasts, share your journey, and stay motivated together. Join our community today! </Text>
          <SearchBox/>
        </View>

         <View className='w-full h-[1px] bg-zinc-400 mt-4'>

        </View>
        <Text className='text-white text-xl font-semibold mt-4 mb-2 ' > Top Gyms Of The Town </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className='mb-8 ' >
          {/* Gym Cards */}
          <GymInfoCard gym={gym} />

          </ScrollView>

        


 
      </ScrollView>
    </>
  )
}

export default index