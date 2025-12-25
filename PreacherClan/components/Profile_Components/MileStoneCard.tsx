import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState, useEffect } from 'react'
import { View, Text } from 'react-native'

export default function MileStoneCard() {

  const [status, setStatus] = useState<string>('')
  const [score, setScore] = useState<number>(0)

  const fetchProfileStatus = async () => {
    const profile = await AsyncStorage.getItem('profile')
    if (profile) {
      const parsedProfile = JSON.parse(profile)
      const preacherScore = parsedProfile.preacherScore || 0

      setScore(preacherScore)

      if (preacherScore >= 800) {
        return 'Master'
      } else if (preacherScore >= 600) {
        return 'Legend'
      } else if (preacherScore >= 400) {
        return 'Elite'
      } else if (preacherScore >= 200) {
        return 'Veteran'
      } else {
        return 'Rookie'
      }
    }

    return 'Rookie'
  }

  useEffect(() => {
    const setStatusFunc = async () => {
      const rank = await fetchProfileStatus()
      setStatus(rank)
    }

    setStatusFunc()
  }, []) 

  return (
    <View className="bg-red-600 border border-zinc-800 rounded-lg p-4">
      <Text className="text-zinc-950 text-lg font-semibold font-bartle mb-3">
        Warrior’s Chronicle
      </Text>

      <View className="space-y-3">
        <View>
          <View className="w-full bg-black p-2 rounded-lg">
            <Text className="text-white text-center font-semibold font-ScienceGothic">
              {status}
            </Text>
          </View>

          <Text className="text-zinc-900 text-xs text-center font-ScienceGothic">
            The Status in Clan
          </Text>
        </View>

        <View className="bg-black h-0.5 mt-1 mb-1 w-full rounded-full" />

        <View>
          <Text className="text-black text-center font-semibold font-ScienceGothic">
            Preacher Score | {score}
          </Text>
          <Text className="text-zinc-900 text-xs text-center font-ScienceGothic">
            Consistency score
          </Text>
        </View>
      </View>
    </View>
  )
}
