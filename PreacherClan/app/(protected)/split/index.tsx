import { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";

import { WorkoutSplit } from "@/constants/split";
import WeekCalendar from "@/components/Split/WeekCalendar";
import SplitCard from "@/components/Split/SplitCard";
import { MOCK_SPLITS } from "@/constants/split";
import SuggestedSplits from "@/components/Split/SuggestedSplits";
import SplitDetailsModal from "@/components/Split/SplitDetailsModal";
import EditSplitModal from "@/components/Split/EditSplitModal";
import { saveSplit, loadSplit } from "@/utils/splitStorage";
import { shareSplit } from "@/utils/shareSplit";
import { useEffect } from "react";


export default function SplitDropdown() {

// states 
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<WorkoutSplit | null>(null);

  const [selectedDay, setSelectedDay] = useState<string>("");

  const [activeSplit, setActiveSplit] = useState<WorkoutSplit | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [editingSplit, setEditingSplit] = useState<WorkoutSplit | null>(null);
  const [editOpen, setEditOpen] = useState(false);


// filtering the splits
  const filteredSplits = useMemo(
    () =>
      MOCK_SPLITS.filter(s =>
        s.split_name.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );


// edit split util
  const handleSplitEdit = () => {
    if (!selected) return;
    setEditingSplit(selected);
    setEditOpen(true);
  };
useEffect(() => {
  (async () => {
    const saved = await loadSplit();
    if (saved) setSelected(saved);
  })();
}, []);


// create split util 
  const handleCreateSplit = () => {
    setEditingSplit({
      split_id: "new",
      split_name: "New Split",
      description: "",
      creator: "You",
      exercises: [],
    });
    setEditOpen(true);
  };


// share split feature
const handleShareSplit = () => {
  if (!selected) return;

  const url = shareSplit(selected);
  console.log("SHARE URL:", url);
};



// filter on days 
  const dayExercises =
    selected?.exercises?.filter(e =>
      e.day?.toLowerCase().startsWith(selectedDay.toLowerCase())
    ) ?? [];


  return (
    <View className="w-[100%] mx-auto mt-4">


{/* select split dropdown */}
      <ScrollView 
      className="w-[100%] mx-auto mt-4"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }} 
    >
      <View className="absolute z-40 right-6 left-6 mb-40">

        <TouchableOpacity
          onPress={() => setOpen(!open)}
          className="bg-white rounded-md h-16 px-4 pr-8 flex-row justify-between items-center"
        >
          <View>
            <Text className="font-bartle text-xs text-black">
              {selected ? selected.split_name : "Choose your BattleForge Split"}
            </Text>

            {selected && (
              <Text className="text-xs text-gray-500 font-ScienceGothic">
                by {selected.creator}
              </Text>
            )}
          </View>

          {open ? <ChevronUp color="black" /> : <ChevronDown color="black" />}
        </TouchableOpacity>


        {open && (
          <ScrollView className="bg-zinc-900 mt-2 rounded-lg max-h-72 border border-zinc-700">

            {/* SEARCH BAR */}
            <View className="p-3">
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search splits..."
                placeholderTextColor="#888"
                className="bg-zinc-800 px-3 py-2 rounded text-white"
              />
            </View>

            {filteredSplits.map(split => (
              <TouchableOpacity
                key={split.split_id}
                onPress={async () => {
  setSelected(split);
  await saveSplit(split);
  setOpen(false);
}}

                className="p-4 border-b border-zinc-700"
              >
                <Text className="text-white font-bartle text-sm">
                  {split.split_name}
                </Text>

                <Text className="text-zinc-300 text-xs font-ScienceGothic">
                  {split.creator}
                </Text>

                <Text className="text-zinc-400 text-xs mt-1">
                  {split.description}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>



      {/* ---------- WEEK CALENDAR ---------- */}
      <WeekCalendar
        restDay="Mo"
        onDaySelect={(d) => setSelectedDay(d)}
      />



      {/* ---------- IF NO SPLIT SELECTED ---------- */}
      {!selected && (
        <View className="w-[90%] mx-auto mt-6">
          <Text className="text-white font-bartle text-lg mb-3">
            No split selected
          </Text>

          {/* <TouchableOpacity
            onPress={handleCreateSplit}
            className="bg-green-600 py-3 rounded-md mb-3"
          >
            <Text className="text-center text-white font-ScienceGothic">
              + Create a Split
            </Text>
          </TouchableOpacity> */}

          <Text className="text-zinc-400 font-ScienceGothic">
            Or choose a preset above
          </Text>
        </View>
      )}



      {/* ---------- SPLIT CARD OR REST DAY ---------- */}
      {selected && (
        <>
          {dayExercises.length > 0 ? (
            <SplitCard
              splitName={selected.split_name}
              exercises={dayExercises}
            />
          ) : (
            <View className="w-[90%] mx-auto mt-6 bg-amber-400 rounded-md p-4">
              <Text className="text-black font-bartle text-lg">
                💤 Rest Day
              </Text>
              <Text className="text-black font-ScienceGothic mt-1">
                No exercises scheduled for {selectedDay}
              </Text>
            </View>
          )}
        </>
      )}



      {/* ---------- ACTION BUTTONS ---------- */}
      {selected && (
        <View className="w-[90%] mx-auto mt-3 flex-row gap-3">

          {/* EDIT */}
          <TouchableOpacity
            onPress={handleSplitEdit}
            className="flex-1 bg-white py-3 rounded-md"
          >
            <Text className="text-center text-black font-ScienceGothic">
              Edit
            </Text>
          </TouchableOpacity>

          {/* SHARE */}
          <TouchableOpacity
            onPress={handleShareSplit}
            className="flex-1 bg-white py-3 rounded-md"
          >
            <Text className="text-center text-black font-ScienceGothic">
              Share
            </Text>
          </TouchableOpacity>
        </View>
      )}



      {/* ---------- CREATE BUTTON (ONLY ONCE) ---------- */}
      {!selected && (
        <View className="w-[90%] mx-auto mt-3">
          <TouchableOpacity
            onPress={handleCreateSplit}
            className="bg-green-600 py-3 rounded-md"
          >
            <Text className="text-center text-white font-ScienceGothic">
              + Create New Split
            </Text>
          </TouchableOpacity>
        </View>
      )}



      {/* ---------- SUGGESTED SPLITS ---------- */}
      <SuggestedSplits
        splits={MOCK_SPLITS}
        onUseSplit={async (split) => {
  setSelected(split);
  await saveSplit(split);
}}

        onOpenSplit={(split) => {
          setActiveSplit(split);
          setModalOpen(true);
        }}
        splitInUseId={selected?.split_id ?? ""}
      />


      {/* ---------- DETAILS MODAL ---------- */}
      <SplitDetailsModal
        visible={modalOpen}
        split={activeSplit}
        onClose={() => setModalOpen(false)}
      />


      {/* ---------- EDIT MODAL ---------- */}
      <EditSplitModal
  visible={editOpen}
  split={editingSplit}
  onClose={() => setEditOpen(false)}
  onSave={async (updated) => {
    console.log("Updated split", updated);

    setSelected(updated);
    await saveSplit(updated);

    setEditOpen(false);
  }}
/>
</ScrollView>


    </View>
  );
}
