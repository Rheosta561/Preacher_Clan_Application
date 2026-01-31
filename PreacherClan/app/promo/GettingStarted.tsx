import GetStartedCard from "@/components/Getting_Started/GetStartedCard";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const DATA = [
  {
    title: "Gamify Your Fitness Journey",
    description:
      "Forge discipline through competition, brotherhood, and consistency — every rep earns glory, every day builds your legend.",
    image: "hero",
  },
  {
    title: "Find your Shield Brothers",
    description:
      "Stand not alone in the iron hall. Discover warriors of your gym and builders of your town — train together, rise together, conquer together.",
    image: "onboarding1",
  },
  {
    title: "Earn Your Rank. Etch Your Saga.",
    description:
      "Climb the ranks through sweat and sacrifice. Guard your streak, claim your Preacher Rank, and carve your name upon the leaderboard of legends.",
    image: "onboarding2",
  },
] as const;

const AUTO_SCROLL_INTERVAL = 3000;

const GettingStarted = () => {
  const scrollRef = useRef<ScrollView>(null);
  const intervalRef = useRef<number | null>(null);
  const isMounted = useRef(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  /** -------------------------------
   *  Auto Scroll (SAFE)
   *  ------------------------------ */
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!isMounted.current) return;

      setCurrentIndex((prev) => {
        const nextIndex = prev === DATA.length - 1 ? 0 : prev + 1;

        scrollRef.current?.scrollTo({
          x: nextIndex * SCREEN_WIDTH,
          animated: true,
        });

        return nextIndex;
      });
    }, AUTO_SCROLL_INTERVAL);

    return () => {
      isMounted.current = false;

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  /** -------------------------------
   *  Scroll Sync
   *  ------------------------------ */
  const handleScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    if (!isMounted.current) return;

    const index = Math.round(
      event.nativeEvent.contentOffset.x / SCREEN_WIDTH
    );

    setCurrentIndex(index);
  };

  /** -------------------------------
   *  Navigation (CRASH SAFE)
   *  ------------------------------ */
  const handleGetStarted = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    router.replace("/auth/login");
  };

  return (
    <View className="flex-1 bg-black">
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        removeClippedSubviews={false} // ANDROID SAFETY
      >
        {DATA.map((item, index) => (
          <View key={index} style={{ width: SCREEN_WIDTH }}>
            <GetStartedCard {...item} />
          </View>
        ))}
      </ScrollView>

      {/* Indicators + CTA */}
      <View className="absolute bottom-14 w-full flex items-center">
        <View className="flex-row mb-4">
          {DATA.map((_, index) => (
            <View
              key={index}
              className={`w-3 h-3 mx-1 rounded-full ${
                currentIndex === index
                  ? "bg-white opacity-100"
                  : "bg-white opacity-40"
              }`}
            />
          ))}
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          className="bg-white w-4/5 p-6 rounded-lg"
          onPress={handleGetStarted}
        >
          <Text className="text-zinc-950 mx-auto font-semibold">
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GettingStarted;
