import React from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

import SwipeableProfileCard from "@/components/SwipableProfileCard";
import ProfileCard from "@/components/ProfileCard";

interface Props {
  currentProfile: any;
  nextProfile?: any;
  onAccept: () => void;
  onReject: () => void;
}

const StackedSwipeCards: React.FC<Props> = ({
  currentProfile,
  nextProfile,
  onAccept,
  onReject,
}) => {
  const nextCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(0.95) }],
    opacity: withTiming(0.6),
  }));

  return (
    <View className="items-center justify-center w-[100%] ">


      {nextProfile && (
        <Animated.View
          style={[
            { position: "absolute", top: 12, zIndex: 0 },
            nextCardStyle,
          ]}
          className='w-[90%]'
        >
          <ProfileCard profile={nextProfile} />
        </Animated.View>
      )}

      {/* CURRENT CARD */}
      <View style={{ zIndex: 1 }} className="w-[90%]">
        <SwipeableProfileCard
          profile={currentProfile}
          onAccept={onAccept}
          onReject={onReject}
        />
      </View>

    </View>
  );
};

export default StackedSwipeCards;
