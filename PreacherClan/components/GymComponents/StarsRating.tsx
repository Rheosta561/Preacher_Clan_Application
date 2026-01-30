import React from "react";
import { View, Text } from "react-native";
import { Star } from "lucide-react-native";

export function StarRating({ rating = 0 }: { rating: number }) {
  return (
    <View className="flex-row items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={16}
          color="#facc15"
          fill={i <= rating ? "#facc15" : "transparent"}
        />
      ))}
      <Text className="text-zinc-400 text-xs ml-1">
        {rating.toFixed(1)}
      </Text>
    </View>
  );
}
