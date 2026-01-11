import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MotiView } from "moti";
import { ChevronDown, MoreVertical } from "lucide-react-native";
import ExerciseModal from "./ExerciseModal";

import { WorkoutSplit, SplitExercise } from "@/constants/split";

interface Props {
  visible: boolean;
  split: WorkoutSplit | null;
  onClose: () => void;
}

const SplitDetailsModal = ({ visible, split, onClose }: Props) => {

  const [openDay, setOpenDay] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] =
    useState<SplitExercise | null>(null);

  if (!split) return null;

  // Unique days
  const days = [...new Set(split.exercises.map(e => e.day))];

  return (
    <>
      <Modal visible={visible} transparent animationType="fade">
        <View className="flex-1 bg-black/70 justify-center items-center">

          <MotiView
            from={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 250 }}
            className="bg-zinc-950 border border-zinc-800 rounded-xl w-[92%] max-h-[88%] overflow-hidden"
          >
            {/* HEADER */}
            <View className="p-4 border-b border-zinc-800">
              <Text className="text-white font-bartle text-2xl">
                {split.split_name}
              </Text>

              <Text className="text-zinc-400 mt-1 text-sm leading-5">
                {split.description}
              </Text>
            </View>

            {/* SCROLL CONTENT */}
            <ScrollView className="p-4">

              {days.map(day => {
                const isOpen = day === openDay
                const exercises = split.exercises.filter(e => e.day === day)

                return (
                  <View key={day} className="mb-3">

                    {/* DAY HEADER */}
                    <TouchableOpacity
                      onPress={() =>
                        setOpenDay(prev => (prev === day ? null : day))
                      }
                      className="flex-row justify-between items-center bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2"
                    >
                      <Text className="text-white font-bartle text-lg">
                        {day}
                      </Text>

                      <ChevronDown
                        size={18}
                        color="white"
                        style={{
                          transform: [{ rotate: isOpen ? "180deg" : "0deg" }],
                        }}
                      />
                    </TouchableOpacity>

                    {/* EXERCISES */}
                    {isOpen && (
                      <MotiView
                        from={{ opacity: 0, translateY: -5 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ duration: 200 }}
                        className="mt-2"
                      >
                        {exercises.map((ex, idx) => (
                          <View
                            key={idx}
                            className="flex-row justify-between items-center bg-zinc-800 rounded-md px-3 py-2 mb-2"
                          >
                            {/* Left */}
                            <View>
                              <Text className="text-white font-ScienceGothic text-base">
                                {ex.name}
                              </Text>

                              <Text className="text-zinc-400 text-xs">
                                {ex.sets} × {ex.reps}
                              </Text>
                            </View>

                            {/* 3 DOTS */}
                            <TouchableOpacity
                              onPress={() => setSelectedExercise(ex)}
                              className="h-8 w-8 bg-zinc-900 rounded-full items-center justify-center"
                            >
                              <MoreVertical size={18} color="white" />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </MotiView>
                    )}
                  </View>
                )
              })}

              <View className="h-3" />

            </ScrollView>

            {/* FOOTER */}
            <TouchableOpacity
              onPress={onClose}
              className="bg-red-600 py-3"
            >
              <Text className="text-center text-white font-ScienceGothic">
                Close
              </Text>
            </TouchableOpacity>

          </MotiView>
        </View>
      </Modal>

      {/* Exercise Modal */}
      <ExerciseModal
        visible={!!selectedExercise}
        exercise={selectedExercise}
        onClose={() => setSelectedExercise(null)}
      />
    </>
  );
};

export default SplitDetailsModal;
