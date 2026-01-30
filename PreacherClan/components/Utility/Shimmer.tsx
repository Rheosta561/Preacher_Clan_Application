import React from 'react'
import ShimmerPlaceholder from 'react-native-shimmer-placeholder'
import { LinearGradient } from 'expo-linear-gradient'

export default function Shimmer({
  width,
  height,
  borderRadius = 8,
  style,
}: any) {
  return (
    <ShimmerPlaceholder
      LinearGradient={LinearGradient}
      shimmerStyle={[
        {
          width,
          height,
          borderRadius,
        },
        style,
      ]}
      shimmerColors={['#1a1a1a', '#2a2a2a', '#1a1a1a']}
    />
  )
}
