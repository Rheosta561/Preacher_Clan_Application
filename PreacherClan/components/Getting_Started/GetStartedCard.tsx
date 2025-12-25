import { GetStartedCard as GetStartedCardInterface } from '@/constants/constants'
import React from 'react'
import { Image, Text, View } from 'react-native'
import { images } from '@/constants/constants'

const GetStartedCard = ({ title, description, image }: GetStartedCardInterface
) => {
    // console.log(image);
  return (
    <View className='h-full  border-red-400 flex flex-col '>
      <View className='h-[68%]  border-green-400 flex items-center justify-center'>
        <View className='bg-red-900 h-full w-full'>
            <Image source={images[image]} style={{ width: '100%', height: '100%' ,  }} />


        </View>
        <View className='bg-black/50 h-full w-full absolute flex flex-col justify-between py-6'>
           
           <View className=' h-24 w-full flex flex-row justify-end px-6 pt-2'>
            <View className='h-full w-24  ml-6 mt-2 rounded-lg '>
                <Image source={require('@/assets/images/bg_removed_logo.png')} style={{ width: '100%', height: '100%'  , borderRadius: 100 }} />
            </View>
           </View>
            <Text className='text-lg font-semibold font-bartle text-zinc-50   text-left px-6 w-/5'>{title}</Text>
        </View>
      </View>
      <View className='h-2/5  border-blue-400 p-6 flex items-center '>
        {/* <Text className='text-2xl font-bold text-zinc-50 mb-4 text-justify'>{title}</Text> */}
        <Text className='text-zinc-200 text-sm  font-ScienceGothic'>{description}</Text>
      </View>
    </View>
  )
}

export default GetStartedCard