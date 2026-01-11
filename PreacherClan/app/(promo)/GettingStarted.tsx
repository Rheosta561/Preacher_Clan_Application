import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import GetStartedCard from '@/components/Getting_Started/GetStartedCard'
import { useRouter } from 'expo-router'



const { width: SCREEN_WIDTH } = Dimensions.get('window')



const DATA = [
  {
    title: 'Gamify Your Fitness Journey',
    description:
      'Forge discipline through competition, brotherhood, and consistency — every rep earns glory, every day builds your legend.',
    image: 'hero',
  },
  {
    title: 'Find your Shield Brothers',
    description:
      'Stand not alone in the iron hall. Discover warriors of your gym and builders of your town — train together, rise together, conquer together.',
    image: 'onboarding1',
  },
  {
    title: 'Earn Your Rank. Etch Your Saga.',
    description:
      'Climb the ranks through sweat and sacrifice. Guard your streak, claim your Preacher Rank, and carve your name upon the leaderboard of legends.',
    image: 'onboarding2',
  },
] as const

const AUTO_SCROLL_INTERVAL = 3000 // 3 seconds

const GettingStarted = () => {
  const scrollRef = useRef<ScrollView>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const router = useRouter()
  const handleGetStarted = () =>{
    router.push('/(auth)/login')
  }
  
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex =
        currentIndex === DATA.length - 1 ? 0 : currentIndex + 1

      scrollRef.current?.scrollTo({
        x: nextIndex * SCREEN_WIDTH,
        animated: true,
      })

      setCurrentIndex(nextIndex)
    }, AUTO_SCROLL_INTERVAL)

    return () => clearInterval(interval)
  }, [currentIndex])

 
  const handleScrollEnd = (event: any) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / SCREEN_WIDTH
    )
    setCurrentIndex(index)
  }

  return (
    <View className="flex-1 bg-black">

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
      >
        {DATA.map((item, index) => (
          <View key={index} style={{ width: SCREEN_WIDTH }}>
            <GetStartedCard {...item} />
          </View>
        ))}
      </ScrollView>


      <View className="absolute bottom-14 w-full flex items-center">

        <View className="flex-row mb-4">
          {DATA.map((_, index) => (
            <View
              key={index}
              className={`w-3 h-3 mx-1 rounded-full ${
                currentIndex === index
                  ? 'bg-white opacity-100'
                  : 'bg-white opacity-40'
              }`}
            />
          ))}
        </View>


        <TouchableOpacity className="bg-white w-4/5 p-6 rounded-lg" onPress={handleGetStarted}>
          <Text className="text-zinc-950 mx-auto font-semibold">
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default GettingStarted
