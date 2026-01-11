import React, { useEffect } from "react";
import { Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface Props {
  visible: boolean;
  type: "success" | "info" | "error";
  title: string;
  message?: string;
  onHide: () => void;
}

const CustomToast: React.FC<Props> = ({
  visible,
  type,
  title,
  message,
  onHide,
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withTiming(0, { duration: 200 });

      const timeout = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 200 });
        translateY.value = withTiming(-20, { duration: 200 });
        onHide();
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [visible]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const bg =
    type === "success"
      ? "bg-green-900"
      : type === "error"
      ? "bg-red-600"
      : "bg-zinc-800";

  return (
    <Animated.View
      pointerEvents="box-none" 
      style={style}
      className={`absolute w-[90%] top-14 z-50 self-center px-4 py-3 rounded-lg ${bg}`}
    >
      <Text className="text-white font-semibold font-ScienceGothic">
        {title}
      </Text>

      {message && (
        <Text className="text-zinc-200 text-sm mt-1 font-ScienceGothic">
          {message}
        </Text>
      )}
    </Animated.View>
  );
};

export default CustomToast;
