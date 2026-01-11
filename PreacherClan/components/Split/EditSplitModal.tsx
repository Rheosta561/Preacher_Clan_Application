import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from "react-native";
import { MotiView } from "moti";
import { ChevronDown, GripVertical } from "lucide-react-native";
import DraggableFlatList from "react-native-draggable-flatlist";

import {
  WorkoutSplit,
  SplitExercise,
  ExerciseDetails,
  PRESET_EXERCISES,
} from "@/constants/split";

/* ---------------- NORMALIZE DAY VALUES ---------------- */
const normalizeDay = (d: string) => {
  const t = d.toLowerCase();

  if (t.startsWith("mo")) return "Monday";
  if (t.startsWith("tu")) return "Tuesday";
  if (t.startsWith("we")) return "Wednesday";
  if (t.startsWith("th")) return "Thursday";
  if (t.startsWith("fr")) return "Friday";
  if (t.startsWith("sa")) return "Saturday";
  if (t.startsWith("su")) return "Sunday";

  return d;
};

const WEEK_DAYS = [
  "Monday","Tuesday","Wednesday",
  "Thursday","Friday","Saturday","Sunday"
];

interface Props {
  visible: boolean;
  split: WorkoutSplit | null;
  onClose: () => void;
  onSave: (updated: WorkoutSplit) => void;
}

const EditSplitModal = ({ visible, split, onClose, onSave }: Props) => {

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const [exercises, setExercises] = useState<SplitExercise[]>([]);
  const [openDay, setOpenDay] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  /* ---------------- LOAD SPLIT ---------------- */
  useEffect(() => {
    if (!split) return;

    setName(split.split_name);
    setDesc(split.description);

    setExercises(
      (split.exercises ?? []).map(e => ({
        ...e,
        day: normalizeDay(e.day),
        sets: e.sets || 3,
        reps: e.reps || 10
      }))
    );
  }, [split]);

  if (!split) return null;


  /* ---------------- HELPERS ---------------- */

  const filteredPresets = PRESET_EXERCISES.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  const alreadyAdded = (day: string, name: string) =>
    exercises.some(e => e.day === day && e.name === name);

  const addExercise = (day: string, preset: ExerciseDetails) => {
    setExercises(prev => [
      ...prev,
      { ...preset, day, sets: preset.sets ?? 3, reps: preset.reps ?? 10 }
    ]);
  };

  const addBlankExercise = (day: string) => {
    setExercises(prev => [
      ...prev,
      { day, name: "New Exercise", sets: 3, reps: 10 }
    ]);
  };

  const updateExercise = (index: number, field: keyof SplitExercise, value: any) =>
    setExercises(prev => {
      const copy = [...prev];
      (copy[index] as any)[field] = value;
      return copy;
    });

  const removeExercise = (index: number) =>
    setExercises(prev => prev.filter((_, i) => i !== index));


  /* ---------------- VALIDATION ---------------- */

  const validate = () => {

    if (!name.trim()) {
      Alert.alert("Validation", "Split name is required.");
      return false;
    }

    if (desc.trim().length < 10) {
      Alert.alert("Validation", "Description must be at least 10 characters.");
      return false;
    }

    if (!exercises.length) {
      Alert.alert("Validation", "Add at least one exercise.");
      return false;
    }

    for (let ex of exercises) {
      if (!ex.name.trim()) {
        Alert.alert("Validation", "Exercise name cannot be empty.");
        return false;
      }
      if (ex.sets < 1 || ex.reps < 1) {
        Alert.alert("Validation", "Sets & Reps must be at least 1.");
        return false;
      }
    }

    return true;
  };


  /* ---------------- SAVE ---------------- */

  const handleSave = () => {
    if (!validate()) return;

    onSave({
      ...split,
      split_name: name,
      description: desc,
      exercises,
    });
  };


  /* ---------------- UI ---------------- */

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/70 justify-center items-center">

        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-zinc-950 w-[92%] max-h-[90%] rounded-xl border border-zinc-800"
        >

          {/* HEADER */}
          <View className="p-4 border-b border-zinc-800">
            <Text className="text-white text-xl font-bartle mb-3">
              Edit Split
            </Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Split Name"
              placeholderTextColor="#777"
              className="bg-zinc-900 font-ScienceGothic text-white px-3 py-2 rounded mb-2"
            />

            <TextInput
              value={desc}
              onChangeText={setDesc}
              placeholder="Description"
              placeholderTextColor="#777"
              multiline
              className="bg-zinc-900 font-ScienceGothic text-white px-3 py-2 rounded"
            />
          </View>


          {/* BODY */}
          <FlatList
            data={WEEK_DAYS}
            keyExtractor={d => d}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item: day }) => {

              const dayExercises = exercises.filter(e => e.day === day);
              const isOpen = openDay === day;

              return (
                <View key={day} className="mb-6">

                  {/* DAY HEADER */}
                  <TouchableOpacity
                    onPress={() =>
                      setOpenDay(prev => prev === day ? null : day)
                    }
                    className="flex-row justify-between bg-zinc-900 border border-zinc-800 px-3 py-2 rounded"
                  >
                    <Text className="text-white font-bartle text-lg">
                      {day}
                    </Text>

                    <ChevronDown
                      color="white"
                      style={{ transform: [{ rotate: isOpen ? "180deg" : "0deg" }] }}
                    />
                  </TouchableOpacity>


                  {isOpen && (
                    <View className="mt-3">

                      {/* SEARCH */}
                      <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search exercises…"
                        placeholderTextColor="#777"
                        className="bg-zinc-800 font-ScienceGothic text-white px-3 py-2 rounded mb-3"
                      />

                      {/* PRESETS */}
                      <FlatList
                        data={filteredPresets}
                        keyExtractor={p => p.name}
                        style={{ maxHeight: 160 }}
                        renderItem={({ item: p }) => {

                          const exists = alreadyAdded(day, p.name);

                          return (
                            <TouchableOpacity
                              disabled={exists}
                              onPress={() => addExercise(day, p)}
                              className={`px-3 py-2 rounded mb-1 ${
                                exists ? "bg-zinc-700 opacity-60"
                                       : "bg-blue-700"
                              }`}
                            >
                              <Text className="text-white font-ScienceGothic">
                                {p.name} {exists ? "✓ Added" : ""}
                              </Text>
                            </TouchableOpacity>
                          );
                        }}
                      />

                      {/* Add Blank */}
                      <TouchableOpacity
                        onPress={() => addBlankExercise(day)}
                        className="bg-green-700 py-2 rounded mb-3"
                      >
                        <Text className="text-center font-ScienceGothic text-white">
                          + Add Custom Exercise
                        </Text>
                      </TouchableOpacity>


                      {/* DRAG + EDIT LIST */}
                      <DraggableFlatList
                        data={dayExercises}
                        keyExtractor={(_, i) => i.toString()}
                        onDragEnd={({ data }) => {
                          const others = exercises.filter(e => e.day !== day);
                          setExercises([...others, ...data]);
                        }}
                        renderItem={({ item, drag }) => {

                          const idx = exercises.findIndex(e => e === item);

                          return (
                            <TouchableOpacity
                              onLongPress={drag}
                              activeOpacity={0.9}
                              className="bg-zinc-800 px-3 py-2 rounded mb-2"
                            >

                              <View className="flex-row items-center gap-2">
                                <GripVertical color="white" />

                                <TextInput
                                  value={item.name}
                                  onChangeText={t =>
                                    updateExercise(idx, "name", t)
                                  }
                                  className="text-white font-ScienceGothic flex-1"
                                />
                              </View>

                              <View className="flex-row gap-2 mt-2">

                                <TextInput
                                  value={String(item.sets)}
                                  onChangeText={t =>
                                    updateExercise(idx, "sets", Number(t))
                                  }
                                  keyboardType="numeric"
                                  className="bg-zinc-900 text-white font-ScienceGothic px-2 py-1 rounded w-16"
                                />

                                <TextInput
                                  value={String(item.reps)}
                                  onChangeText={t =>
                                    updateExercise(idx, "reps", Number(t))
                                  }
                                  keyboardType="numeric"
                                  className="bg-zinc-900 text-white font-ScienceGothic px-2 py-1 rounded w-16"
                                />

                                <TouchableOpacity
                                  onPress={() => removeExercise(idx)}
                                  className="bg-red-600 px-3 rounded justify-center"
                                >
                                  <Text className="text-white font-ScienceGothic text-xs">
                                    Remove
                                  </Text>
                                </TouchableOpacity>

                              </View>

                            </TouchableOpacity>
                          );
                        }}
                      />

                    </View>
                  )}
                </View>
              );
            }}
          />


          {/* FOOTER */}
          <View className="p-4 border-t border-zinc-800">
            <TouchableOpacity
              onPress={handleSave}
              className="bg-green-600 py-2 rounded mb-2"
            >
              <Text className="text-center font-ScienceGothic text-white">
                Save Changes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              className="bg-zinc-800 py-2 rounded"
            >
              <Text className="text-center font-ScienceGothic text-white">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>

        </MotiView>
      </View>
    </Modal>
  );
};

export default EditSplitModal;
