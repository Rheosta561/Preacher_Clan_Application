import React, { useState, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { MotiView } from "moti";
import { X, ChevronUp, ChevronDown, Minus, Plus } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

import { ExerciseDetails, PRESET_EXERCISES } from "@/constants/split";

/* ================= PROPS ================= */

interface Props {
  visible: boolean;
  onClose: () => void;
  onCreate: (payload: {
    title: string;
    exercises: ExerciseDetails[];
  }) => void;

  loading : boolean ; 
}

/* ================= COMPONENT ================= */

export default function CreateWorkoutJamModal({
  visible,
  onClose,
  onCreate,
  loading 
}: Props) {
  const [title, setTitle] = useState("Valhalla Jam");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ExerciseDetails[]>([]);

  /* ---------- FILTERED EXERCISES ---------- */

  const filteredExercises = useMemo(() => {
    return PRESET_EXERCISES.filter(ex =>
      ex.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  /* ---------- ADD / REMOVE ---------- */

  const toggleExercise = (exercise: ExerciseDetails) => {
    setSelected(prev => {
      const exists = prev.find(e => e.name === exercise.name);
      if (exists) {
        return prev.filter(e => e.name !== exercise.name);
      }
      return [
        ...prev,
        {
          ...exercise,
          sets: exercise.sets ?? 3,
          reps: exercise.reps ?? 10,
        },
      ];
    });
  };

  /* ---------- REORDER ---------- */

  const moveExercise = (index: number, dir: "up" | "down") => {
    setSelected(prev => {
      const arr = [...prev];
      const newIndex = dir === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= arr.length) return prev;

      const item = arr[index];
      arr.splice(index, 1);
      arr.splice(newIndex, 0, item);
      return arr;
    });
  };

  /* ---------- MODIFY SETS / REPS ---------- */

  const updateField = (
    index: number,
    field: "sets" | "reps",
    delta: number
  ) => {
    setSelected(prev => {
      const arr = [...prev];
      const value = Math.max(1, (arr[index][field] || 1) + delta);
      arr[index] = { ...arr[index], [field]: value };
      return arr;
    });
  };

  /* ---------- CREATE ---------- */

  const handleCreate = () => {
    if (selected.length === 0) return;

    onCreate({
      title,
      exercises: selected,
    });

    setSelected([]);
    setSearch("");
    onClose();
  };

  /* ================= UI ================= */

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/80 justify-center px-4">

        <MotiView
          from={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 250 }}
          className="bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 max-h-[85%]"
        >
          {/* ---------- HEADER ---------- */}
          <View className="flex-row justify-between items-center p-6 pr-10 border-b border-zinc-800">
            <Text className="text-white text-xl font-bartle">
              Create Valhalla Jam
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={22} color="white" />
            </TouchableOpacity>
          </View>

          {/* ---------- BODY ---------- */}
          <ScrollView
            className="p-4"
            showsVerticalScrollIndicator={false}
          >
            {/* JAM TITLE */}
            <View className="mb-4">
              <Text className="text-zinc-400 text-xs mb-2 font-ScienceGothic">
                Jam Title
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                className="bg-zinc-900 text-white px-4 py-3 rounded-md font-ScienceGothic"
              />
            </View>

            {/* SEARCH */}
            <View className="mb-4">
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search exercises..."
                placeholderTextColor="#666"
                className="bg-zinc-900 text-white px-4 py-3 rounded-md font-ScienceGothic"
              />
            </View>

            {/* EXERCISE PICKER */}
            <Text className="text-white font-bartle mb-2">
              Select Exercises
            </Text>

            {filteredExercises.map(ex => {
              const active = selected.some(s => s.name === ex.name);

              return (
                <TouchableOpacity
                  key={ex.name}
                  onPress={() => toggleExercise(ex)}
                  className={`mb-2 p-3 rounded-md border ${
                    active
                      ? "bg-red-600/20 border-red-500"
                      : "bg-zinc-900 border-zinc-800"
                  }`}
                >
                  <Text className="text-white font-ScienceGothic">
                    {ex.name}
                  </Text>
                  <Text className="text-zinc-400 font-ScienceGothic text-xs">
                    {ex.equipment} • {ex.difficulty}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {/* ORDER + CONFIG */}
            {selected.length > 0 && (
              <>
                <Text className="text-white font-bartle mt-5 mb-2">
                  Workout Order & Intensity
                </Text>

                {selected.map((ex, i) => (
                  <View
                    key={ex.name}
                    className="bg-zinc-900 rounded-md px-3 py-3 mb-2"
                  >
                    <View className="flex-row justify-between items-center">
                      <Text className="text-white font-ScienceGothic">
                        {i + 1}. {ex.name}
                      </Text>

                      <View className="flex-row gap-2">
                        <TouchableOpacity
                          onPress={() => moveExercise(i, "up")}
                          disabled={i === 0}
                        >
                          <ChevronUp size={18} color={i === 0 ? "#444" : "white"} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => moveExercise(i, "down")}
                          disabled={i === selected.length - 1}
                        >
                          <ChevronDown
                            size={18}
                            color={i === selected.length - 1 ? "#444" : "white"}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* SETS / REPS */}
                    <View className="flex-row gap-6 mt-3">
                      {/* SETS */}
                      <View className="flex-row items-center gap-2">
                        <Text className="text-zinc-400 text-xs font-ScienceGothic">Sets</Text>
                        <TouchableOpacity onPress={() => updateField(i, "sets", -1)}>
                          <Minus size={14} color="white" />
                        </TouchableOpacity>
                        <Text className="text-white font-ScienceGothic">{ex.sets}</Text>
                        <TouchableOpacity onPress={() => updateField(i, "sets", 1)}>
                          <Plus size={14} color="white" />
                        </TouchableOpacity>
                      </View>

                      {/* REPS */}
                      <View className="flex-row items-center gap-2">
                        <Text className="text-zinc-400 text-xs font-ScienceGothic">Reps</Text>
                        <TouchableOpacity onPress={() => updateField(i, "reps", -1)}>
                          <Minus size={14} color="white" />
                        </TouchableOpacity>
                        <Text className="text-white font-ScienceGothic">{ex.reps}</Text>
                        <TouchableOpacity onPress={() => updateField(i, "reps", 1)}>
                          <Plus size={14} color="white" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </>
            )}

            {/* CREATE BUTTON */}
            <TouchableOpacity
              onPress={handleCreate}
              disabled={selected.length === 0}
              className={`mt-4 mb-8 py-3 rounded-md ${
                selected.length === 0 ? "bg-zinc-700" : "bg-white"
              }`}
            >
                {loading ? (<ActivityIndicator color= "white"/>):
                (  <Text
                className={`text-center font-ScienceGothic ${
                  selected.length === 0 ? "text-zinc-400" : "text-black"
                }`}
              >
                Create Jam
              </Text>)
                }
            
            </TouchableOpacity>
          </ScrollView>

          {/* GRADIENT EDGE */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.5)"]}
            className="absolute bottom-0 left-0 right-0 h-10"
          />
        </MotiView>
      </View>
    </Modal>
  );
}
