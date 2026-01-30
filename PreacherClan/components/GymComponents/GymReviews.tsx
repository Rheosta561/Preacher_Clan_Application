import React from "react";
import { View, Text } from "react-native";
import { StarRating } from "./StarsRating";

export default function GymReviews({ reviews = [] }: any) {
  if (!reviews.length) {
    return (
      <Text className="text-zinc-500 text-sm mt-2">
        No reviews yet
      </Text>
    );
  }

  return (
    <View className="gap-3 mt-2 ">
      {reviews.map((r: any) => (
        <View
          key={r._id}
          className="bg-zinc-900 p-3 rounded-lg"
        >
          <View className="flex-row justify-between items-center">
            <Text className="text-white font-semibold font-ScienceGothic">
              {r.userId.name}
            </Text>
            <StarRating rating={r.rating} />
          </View>

          <Text className="text-zinc-400 text-xs font-ScienceGothic">
            @{r.userId.username} · Score {r.userId.preacherScore}
          </Text>

          <Text className="text-zinc-300 mt-2 text-sm font-ScienceGothic">
            {r.review}
          </Text>
        </View>
      ))}
    </View>
  );
}
