import { useUser } from "@/context/userContext";
import React, { forwardRef } from "react";
import { View, Text, Image } from "react-native";
import ViewShot from "react-native-view-shot";

type Props = {
  image: string;
  streak: number;
  challengeTitle: string;
  streakLabel?: string;
};

const ShareCard = forwardRef<ViewShot, Props>(
  ({ image, streak, challengeTitle, streakLabel }, ref) => {

    const {user} = useUser();
    return (
      <ViewShot
        ref={ref}
        options={{ format: "png", quality: 1 }}
        style={{ width: '100%' , borderRadius: 10, overflow: "hidden" }}
      >
        <View className="bg-black w-full  rounded-md  overflow-hidden">

          {/* MAIN IMAGE */}
          <Image
            source={{ uri: image }}
            className="w-full  h-96"
            resizeMode="cover"
          />

          {/* ---- OVERLAYS ---- */}

          {/* LOGO (TOP-LEFT) */}
          <View className="absolute top-3 left-3 rounded-full  ">
            <Image
              source={require("@/assets/images/repmateKing.png")}
              style={{ width: 50, height: 50 }}
              resizeMode="contain"
            />
          </View>

          {/* username badge */}
          <View className="absolute top-3 right-3  rounded-full px-3 py-2 shadow-md shadow-black ">
            <Text className="text-zinc-200 font-ScienceGothic">
              @{user?.username}
            </Text>
          </View>

          {/* FOOTER GRADIENT PANEL */}
          <View className="absolute bottom-0 left-0 right-0 bg-black/70 p-3">

            <Text className="text-white font-ScienceGothic text-lg">
              {challengeTitle}
            </Text>

            {streakLabel && (
              <Text className="text-orange-400 font-ScienceGothic text-sm">
                {streakLabel}
              </Text>
            )}

            <Text className="text-zinc-300 font-ScienceGothic text-xs mt-1">
              preacherclan.app
            </Text>
          </View>

        </View>
      </ViewShot>
    );
  }
);

export default ShareCard;
