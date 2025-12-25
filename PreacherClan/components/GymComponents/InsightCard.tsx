import React from "react";
import { View, Text } from "react-native";
import { Lightbulb } from "lucide-react-native";

interface Props {
  title: string;
  insight: string;
  footer?: string;
}

const InsightCard: React.FC<Props> = ({ title, insight, footer }) => {
  return (
    <View className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
      <View className=" flex flex-row gap-2">
        <Lightbulb size={22} color="#fbbf24" className="self-end" />
      <Text className="text-white text-xl font-semibold font-ScienceGothic mb-2">{title}</Text>

      </View>
      
      <Text className="text-zinc-300 font-ScienceGothic text-sm leading-relaxed">{insight}</Text>

      {footer && (
        <Text className="text-zinc-500 text-xs italic mt-3 border-t border-zinc-700 pt-2">
          {footer}
        </Text>
      )}
    </View>
  );
};

export default InsightCard;
