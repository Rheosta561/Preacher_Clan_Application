import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Dumbbell } from "lucide-react-native";

interface Props {
  day: string;
  date: string;
  preachersCount: number;
  capacityPercent: number;
  maxCapacity: number;
}

const GymCapacity: React.FC<Props> = ({
  day,
  date,
  preachersCount,
  capacityPercent,
  maxCapacity,
}) => {
  const [progress, setProgress] = useState(0);
  const radius = 40;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setProgress(Math.min(current, capacityPercent));
      if (current >= capacityPercent) clearInterval(interval);
    }, 10);
    return () => clearInterval(interval);
  }, [capacityPercent]);

  return (
    <View className="bg-red-600 border border-zinc-800 rounded-xl p-4 flex-row justify-between items-center">
      <View>
        <Text className="text-black font-ScienceGothic text-3xl font-semibold uppercase">
          {day}
        </Text>
        <Text className="text-black text-lg font-ScienceGothic">{date}</Text>
        <Text className="text-zinc-900 font-ScienceGothic text-xs mt-1">
          {preachersCount} preachers trained today
        </Text>
      </View>

      <View className="items-center">
        <View className="flex-row items-center gap-2 mb-1">
          <Dumbbell size={18} color="#000000" />
          <Text className="text-black font-semibold font-ScienceGothic">Capacity</Text>
        </View>

        <Svg width={100} height={100}>
          <Circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#000000"
            strokeWidth={stroke}
            fill="none"
          />
          <Circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#ffffff"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={
              circumference - (progress / 100) * circumference
            }
            strokeLinecap="round"
            fill="none"
          />
        </Svg>

        <Text className="text-zinc-900 font-ScienceGothic text-xs mt-1">
          {Math.round((progress / 100) * maxCapacity)} / {maxCapacity}
        </Text>
      </View>
    </View>
  );
};

export default GymCapacity;
