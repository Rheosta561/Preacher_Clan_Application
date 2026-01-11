import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";

interface Props {
  onDaySelect?: (day: string) => void;
  restDay?: string;
}

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const WeekCalendar = ({ onDaySelect, restDay }: Props) => {
  const todayIndex = new Date().getDay(); // Sun = 0 ... Sat = 6
  const mapIndex = todayIndex === 0 ? 6 : todayIndex - 1;

  const [selected, setSelected] = useState<number>(mapIndex);

  useEffect(() => {
    onDaySelect?.(DAYS[mapIndex]);
  }, []);

  return (
    <View className="w-fit mx-auto mt-20 p-4 rounded-md bg-red-600 flex-row gap-2 justify-between">
      {DAYS.map((day, index) => {
        const isSelected = index === selected;
        const isRestDay = restDay === day;

        let bgClass = "bg-black";
        let textClass = "text-white";

        if (isRestDay) {
          bgClass = "bg-black";
          textClass = "text-white";
        } else if (isSelected) {
          bgClass = "bg-white";
          textClass = "text-black";
        }

        return (
          <TouchableOpacity
            key={day}
            onPress={() => {
              setSelected(index);
              onDaySelect?.(day);
            }}
            className={`h-12 w-12 rounded-full  ${bgClass}`}
          >
            <Text
              className={`font-ScienceGothic mx-auto my-auto text-sm ${textClass}`}
            >
              {day}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default WeekCalendar;
