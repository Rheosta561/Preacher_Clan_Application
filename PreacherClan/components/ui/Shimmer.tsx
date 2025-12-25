import { View, Animated, StyleSheet, Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useEffect, useRef } from 'react'

const { width } = Dimensions.get('window')

interface Props {
  height: number
  width?: number | string
  borderRadius?: number
  style?: any
}

export default function Shimmer({
  height,
  width: w = '100%',
  borderRadius = 12,
  style,
}: Props) {
  const translateX = useRef(new Animated.Value(-width)).current

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: width,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start()
  }, [])

  return (
    <View
      style={[
        {
          height,
          width: w,
          borderRadius,
          backgroundColor: '#27272a',
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        style={{
          width: '40%',
          height: '100%',
          transform: [{ translateX }],
        }}
      >
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.25)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  )
}
