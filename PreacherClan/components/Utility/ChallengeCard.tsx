import { View, Text } from 'react-native'
import React from 'react'

const ChallengeCard = () => {
  return (
    <View className='h-44 rounded-lg bg-zinc-950 flex flex-row p-3 items-center'>
        <View className='h-28 w-28 rounded-full bg-orange-400'>

        </View>

        <View className='flex-1 ml-4 justify-between py-2 '>
            <Text className='text-white text-lg font-semibold' >Challenge of The Day </Text>
            <Text className='text-zinc-300 text-sm ' >Join the 30-day fitness challenge to boost your health and well-being. Daily workouts, nutrition tips, and community support to keep you motivated!</Text>  
            <View className='h-8 w-full mt-2 bg-zinc-100 rounded-xl items-center justify-center '>
                <Text className='text-zinc-950 font-semibold ' >Join Now</Text>    </View>      
            </View>
      
    </View>
  )
}

export default ChallengeCard