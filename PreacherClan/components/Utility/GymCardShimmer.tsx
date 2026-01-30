import { View } from 'react-native'
import Shimmer from '@/components/Utility/Shimmer'

export default function GymCardShimmer() {
  return (
    <View className="mr-3 w-64 bg-black rounded-xl p-3">
      <Shimmer width="100%" height={120} borderRadius={12} />
      <View className="mt-3 space-y-2">
        <Shimmer width="70%" height={16} />
        <Shimmer width="40%" height={14} />
      </View>
    </View>
  )
}
