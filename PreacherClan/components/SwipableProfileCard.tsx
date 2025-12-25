import React, { useEffect } from "react";
import { Dimensions, View, TouchableOpacity } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { Check, X } from "lucide-react-native";
import Toast from "react-native-toast-message";

import ProfileCard from "@/components/ProfileCard";

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.25;

interface Props {
  profile: any;
  onAccept: () => void;
  onReject: () => void;
}

const SwipeableProfileCard: React.FC<Props> = ({
  profile,
  onAccept,
  onReject,
}) => {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  /* ---------- ENTRY ANIMATION ---------- */
  useEffect(() => {
    translateX.value = 0;
    opacity.value = 0;
    scale.value = 0.95;

    opacity.value = withTiming(1, { duration: 250 });
    scale.value = withSpring(1);
  }, [profile]);

  /* ---------- ACTION HANDLERS ---------- */
  const accept = () => {
    translateX.value = withSpring(width);
    Toast.show({
      type: "success",
      text1: "Request Sent",
      text2: `You liked ${profile?.name}`,
    });
    onAccept();
  };

  const reject = () => {
    translateX.value = withSpring(-width);
    Toast.show({
      type: "info",
      text1: "Skipped",
      text2: `${profile?.name} skipped`,
    });
    onReject();
  };

  /* ---------- PAN GESTURE ---------- */
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd(() => {
      if (translateX.value > SWIPE_THRESHOLD) {
        runOnJS(accept)();
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        runOnJS(reject)();
      } else {
        translateX.value = withSpring(0);
      }
    });

  /* ---------- CARD STYLE ---------- */
  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { scale: scale.value },
      { rotate: `${translateX.value / 20}deg` },
    ],
  }));

  /* ---------- ICON FEEDBACK ---------- */
  const acceptStyle = useAnimatedStyle(() => {
    const o = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolate.CLAMP
    );
    return { opacity: o, transform: [{ scale: 1 + o * 0.2 }] };
  });

  const rejectStyle = useAnimatedStyle(() => {
    const o = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0],
      Extrapolate.CLAMP
    );
    return { opacity: o, transform: [{ scale: 1 + o * 0.2 }] };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={cardStyle} className="w-[100%] ">

        {/* ---------- SWIPE FEEDBACK ICONS ---------- */}
        <Animated.View
          style={[
            { position: "absolute", top: 40, left: 30, zIndex: 20 },
            acceptStyle,
          ]}
        >
          <View className="bg-white p-3 rounded-full">
            <Check size={28} color="black" strokeWidth={3} />
          </View>
        </Animated.View>

        <Animated.View
          style={[
            { position: "absolute", top: 40, right: 30, zIndex: 20 },
            rejectStyle,
          ]}
        >
          <View className="bg-zinc-950 p-3 rounded-full">
            <X size={28} color="white" strokeWidth={3} />
          </View>
        </Animated.View>

        {/* ---------- PROFILE ---------- */}
        <ProfileCard profile={profile}  />

        {/* ---------- OVERLAY BUTTONS ---------- */}
        <View className="absolute bottom-6 left-0 right-0 flex-row justify-center gap-12 z-30">
          <TouchableOpacity
            onPress={reject}
            className="bg-zinc-950 p-4 rounded-full"
          >
            <X size={26} color="white" strokeWidth={3} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={accept}
            className="bg-white p-4 rounded-full"
          >
            <Check size={26} color="black" strokeWidth={3} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

export default SwipeableProfileCard;
