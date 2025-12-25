import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { MotiView } from "moti";

const MatchListener: React.FC = () => {
  const [visible, setVisible] = useState(false);

  // UI TEST ONLY (auto-show)
  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 4000);
    const hideTimer = setTimeout(() => setVisible(false), 8000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <View className="absolute inset-0 z-50 bg-black/70 justify-center items-center">
      <MotiView
        from={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "timing", duration: 450 }}
        className="bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden"
      >
        {/* IMAGE */}
        <Image
          source={require("../assets/images/repmateKing.png")}
          className="w-72 h-72 mx-auto "
          resizeMode="cover"
        />

        {/* TEXT CONTENT */}
        <View className="p-4 items-center">
          <Text className="text-white text-center text-xl font-bartle">
            Match of the Clan
          </Text>

          <Text className="text-zinc-400 text-sm mt-2 text-center font-ScienceGothic">
            A RepMate has accepted your call. Train with honor.
          </Text>
        </View>
      </MotiView>
    </View>
  );
};

export default MatchListener;
