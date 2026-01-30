import { View } from 'react-native'
import Shimmer from './Shimmer'

export default function ChallengeCardShimmer() {
  return (
    <View className="bg-black rounded-lg p-4 border-dashed border-red-500">
      <Shimmer width="100%" height={160} borderRadius={12} />

      <View className="mt-4 space-y-2">
        <Shimmer width="70%" height={20} />
        <Shimmer width="90%" height={14} />
        <Shimmer width="40%" height={36} borderRadius={18} />
      </View>
    </View>
  )
}
