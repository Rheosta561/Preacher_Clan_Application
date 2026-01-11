import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ExerciseModal from "./ExerciseModal";
import { Pencil } from "lucide-react-native";
import { WorkoutSplit } from "@/constants/split";

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  description?: string;
}

interface Props {
  splitName: string| undefined;
  exercises: Exercise[] ;
  onEditSplit?: () => void;
}


const SplitCard = ({ splitName, exercises, onEditSplit }: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] =
    useState<Exercise | null>(null);

  return (
    <View className="w-[90%] mx-auto mt-4 rounded-md bg-zinc-50 p-4">

      {/* ---------- HEADER ---------- */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="font-bartle text-2xl">
          {splitName}
        </Text>

        {/* <TouchableOpacity
          onPress={onEditSplit}
          className="h-8 w-8 bg-black rounded-full items-center justify-center"
        >
          <Pencil size={16} color="white" />
        </TouchableOpacity> */}
      </View>

      {/* ---------- EXERCISES ---------- */}
      {exercises.map((ex, index) => (
        <View
          key={index}
          className="flex-row justify-between items-center mb-2 bg-zinc-200 rounded-md p-3"
        >
          <View>
            <Text className="font-ScienceGothic text-lg">{ex.name}</Text>
            <Text className="text-zinc-700 text-sm">
              {ex.sets} × {ex.reps}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              setSelectedExercise(ex);
              setModalVisible(true);
            }}
            className="h-8 w-8 rounded-full bg-black items-center justify-center"
          >
            <Text className="text-white font-bold">i</Text>
          </TouchableOpacity>
        </View>
      ))}

      <ExerciseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        exercise={selectedExercise}
      />
    </View>
  );
};

export default SplitCard;
