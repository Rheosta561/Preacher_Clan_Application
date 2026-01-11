import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Dumbbell, Check } from "lucide-react-native";
import { MotiView } from "moti";

import ProfileCard from "../ProfileCard";

type TrainerStatus = "idle" | "booking" | "booked";

interface TrainerCardProps {
  profile: any;
  status?: TrainerStatus;
  onBookTrainer?: (trainerId: string) => Promise<void> | void;
}

const TrainerCard = ({
  profile,
  status = "idle",
  onBookTrainer,
}: TrainerCardProps) => {
  const [currentStatus, setCurrentStatus] =
    useState<TrainerStatus>(status);

  const handleBook = async () => {
    if (currentStatus !== "idle") return;

    try {
      setCurrentStatus("booking");
      await onBookTrainer?.(profile.id);
      setCurrentStatus("booked");
    } catch {
      setCurrentStatus("idle");
    }
  };

  const isDisabled = currentStatus !== "idle";

  return (
    <MotiView
      from={{ opacity: 0, translateY: 30 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 400 }}
      className="relative"
    >
      {/* PROFILE */}
      <ProfileCard
        profile={{
          ...profile,
          hideaction: true, // disable send request
        }}
      />

      {/* ACTION STRIP */}
      <View className="px-4 pb-4 bg-zinc-950 border-t border-zinc-800">
        <TouchableOpacity
          disabled={isDisabled}
          onPress={handleBook}
          className={`mt-4 w-full py-3 rounded-md flex-row justify-center items-center ${
            isDisabled
              ? "bg-zinc-800"
              : "bg-zinc-50"
          }`}
        >
          {currentStatus === "booked" ? (
            <>
              <Check size={16} color="black" />
              <Text className="ml-2 text-black font-ScienceGothic text-sm">
                Appointed
              </Text>
            </>
          ) : (
            <>
              <Dumbbell
                size={16}
                color={currentStatus === "booking" ? "#a1a1aa" : "black"}
              />
              <Text
                className={`ml-2 font-ScienceGothic text-sm ${
                  currentStatus === "booking"
                    ? "text-zinc-400"
                    : "text-black"
                }`}
              >
                {currentStatus === "booking"
                  ? "Booking..."
                  : "Book Trainer"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </MotiView>
  );
};

export default TrainerCard;
