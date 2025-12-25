import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

const SplitPromo = () => {
     const router = useRouter();
    const handleClick = ()=>{
       

        router.push('/(protected)/split');
    }
  return (
    <View className='w-full h-fit rounded-md bg-red-600 '>
        <View className='absolute bg-black  h-8 w-16 right-2 top-2 rounded-md'>
            <Text className='text-white mx-auto my-auto font-ScienceGothic'> New </Text>

        </View>
        <View className='p-2'>
            <Text className='mt-2 font-bartle text-xl mx-auto'>
                BattleForge
            </Text>
            <Text className='mx-auto text-xs text-center font-ScienceGothic '>
                BattleForge is your Viking-inspired workout planner — where warriors build training blueprints and clans rise together. 
            </Text>
            <TouchableOpacity className='w-[95%] mx-auto h-8 rounded-md bg-black mt-2   ' onPress={handleClick}>
                <Text className='text-white  font-ScienceGothic mx-auto my-auto'>
                    Get Started 
                </Text>

        </TouchableOpacity>
        </View>

        

    </View>
  )
}

export default SplitPromo