import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { MotiView } from "moti";
type Props = {
  onPress?: () => void | Promise<void>;
};

const VikingCompleted = ({onPress} : Props) => {
  return (
    <View className="absolute inset-0 z-50 bg-black/70 justify-center items-center">

      <MotiView
        from={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "timing", duration: 450 }}
        className="bg-red-600 rounded-3xl border border-red-700/40 overflow-hidden"
      >
        {/* IMAGE */}
        <Image
          source={require("@/assets/images/repmateKing.png")}
          className="w-72 h-72 mx-auto"
          resizeMode="cover"
        />

        {/* TEXT */}
        <View className="p-4 -mt-5 items-center">
          <Text className="text-white text-2xl text-center font-bartle">
            Challenge Conquered
          </Text>

          <Text className="text-black mt-1 font-ScienceGothic text-center">
            You fought with honor today, warrior.
          </Text>

          <Text className="text-zinc-950  font-ScienceGothic text-center">
            Return tomorrow to earn more glory.
          </Text>
        </View>

         <TouchableOpacity
            className="py-3 rounded-md bg-black "
            onPress={onPress}
              >
                <Text className="text-white text-center font-ScienceGothic text-lg">
                    Share with others
                </Text>
              </TouchableOpacity>
      </MotiView>

    </View>
  );
};

export default VikingCompleted;
