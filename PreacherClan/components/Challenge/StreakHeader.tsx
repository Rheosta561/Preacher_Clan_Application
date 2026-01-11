import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StreakHeader = () => {

  const [streak, setStreak] = useState(0);
  const [lastDate, setLastDate] = useState<Date | null>(null);

  const today = new Date();

  const formatDate = (d: Date) =>
    d
      .toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
      .toUpperCase();

  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  useEffect(() => {
    const loadStreak = async () => {
      try {
        const storedDate = await AsyncStorage.getItem("lastChallengeCompletedDate");
        const storedStreak = await AsyncStorage.getItem("challengeStreak");

        let updatedStreak = storedStreak ? Number(storedStreak) : 0;

        if (storedDate) {
          const lastCompleted = new Date(storedDate);
          setLastDate(lastCompleted);

          const todayStart = startOfDay(today);
          const lastStart = startOfDay(lastCompleted);

          const yesterday = new Date(todayStart);
          yesterday.setDate(todayStart.getDate() - 1);

          const twoDaysAgo = new Date(todayStart);
          twoDaysAgo.setDate(todayStart.getDate() - 2);

          const todayDay = today.getDay(); // 0=Sun,1=Mon,...6=Sat
          const lastDay = lastStart.getDay();

          /* =======================
              STREAK LOGIC
          ======================= */

          // CASE 1 — already completed today
          if (lastStart.getTime() === todayStart.getTime()) {
            // do nothing (keep streak same)

          // CASE 2 — NORMAL DAYS (Tue–Sat)
          } else if (todayDay >= 2 && todayDay <= 6) {
            if (lastStart.getTime() === yesterday.getTime()) {
              updatedStreak += 1;
            } else {
              updatedStreak = 0;
            }

          // CASE 3 — MONDAY (Sun or Sat allowed)
          } else if (todayDay === 1) {
            if (
              lastStart.getTime() === yesterday.getTime() || // Sunday
              lastStart.getTime() === twoDaysAgo.getTime()   // Saturday
            ) {
              updatedStreak += 1;
            } else {
              updatedStreak = 0;
            }

          // CASE 4 — SUNDAY (must be Saturday)
          } else if (todayDay === 0) {
            if (lastDay === 6) {
              updatedStreak += 1;
            } else {
              updatedStreak = 0;
            }
          }
        }

        setStreak(updatedStreak);
        await AsyncStorage.setItem("challengeStreak", String(updatedStreak));

      } catch (e) {
        console.log("streak error", e);
      }
    };

    loadStreak();
  }, []);

  return (
    <View className="w-full bg-zinc-50 mb-4 rounded-md flex-row justify-between items-center px-4 py-3">

      <View>
        <Text className="text-black font-bartle text-lg tracking-widest">
          {formatDate(today)}
        </Text>

        {lastDate && (
          <Text className="text-zinc-800 text-xs font-ScienceGothic mt-1">
            Last Challenge: {formatDate(lastDate)}
          </Text>
        )}
      </View>

      <View className="items-end">
        <Text className="text-orange-400 text-2xl">🔥</Text>

        <Text className="text-zinc-800 text-xs font-ScienceGothic">
          {streak} day streak
        </Text>
      </View>
    </View>
  );
};

export default StreakHeader;
