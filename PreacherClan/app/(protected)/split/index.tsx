import { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from "react-native";
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
import { useUser } from "@/context/userContext";

import { apiFetch
 } from "@/utils/Auth/apiFetch";

import CreateWorkoutJamModal from "@/components/WorkoutJam/CreateWorkoutJamModal";


import WorkoutJamPromoCard from "@/components/WorkoutJam/WorkoutJamPromo";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import JoinWorkoutJamModal from "@/components/WorkoutJam/JoinWorkoutJamModal";
import { showToast } from "@/utils/showToast";



export default function SplitDropdown() {
  const isPresetSplit = (split: WorkoutSplit) => {
  return !split.creatorId; // presets don't have creatorId
};


// states 
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [joinOpen, setJoinOpen] = useState(false);
  const [ createOpen , setCreateOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<WorkoutSplit[]>([]);
const [searching, setSearching] = useState(false);
const [searchTimeout, setSearchTimeout] = useState<number | null>(null);

const [savingSplit, setSavingSplit] = useState(false);
const [sharingSplit, setSharingSplit] = useState(false);



  const router= useRouter();
  const [selected, setSelected] = useState<WorkoutSplit | null>(null);

  const [selectedDay, setSelectedDay] = useState<string>("");

  const [activeSplit, setActiveSplit] = useState<WorkoutSplit | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [joiningJam, setJoiningJam] = useState(false);
const [creatingJam, setCreatingJam] = useState(false);

  const [editingSplit, setEditingSplit] = useState<WorkoutSplit | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  // get split from link 
  const [shareLink, setShareLink] = useState("");
const [importingSplit, setImportingSplit] = useState(false);

const extractShareToken = (url: string) => {
  try {
    const parts = url.split("/share/");
    return parts[1] || null;
  } catch {
    return null;
  }
};
const handleImportSplit = async () => {
  const token = extractShareToken(shareLink);

  if (!token) {
    showToast({
      type: "error",
      title: "Invalid link",
      message: "Please paste a valid split link",
    });
    return;
  }

  try {
    setImportingSplit(true);

    const split = await apiFetch<WorkoutSplit>(
      `/split/shared/${token}`,
      { method: "GET" }
    );

    await saveSplit(split);
    setSelected(split);
    setShareLink("");

    showToast({
      type: "success",
      title: "Split imported",
      message: "Split added to your workouts ⚔️",
    });

  } catch (err) {
    console.error("Import failed", err);
    showToast({
      type: "error",
      title: "Import failed",
      message: "Link expired or invalid",
    });
  } finally {
    setImportingSplit(false);
  }
};



// filtering the splits
  const filteredSplits = useMemo(
    () =>
      MOCK_SPLITS.filter(s =>
        s.split_name.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );
// split creator helper 
  const createSplitFromPreset = async (split: WorkoutSplit) => {
  const res = await apiFetch<WorkoutSplit>(
    "/split/create",
    {
      method: "POST",
      body: {
        split_name: split.split_name,
        description: split.description,
        exercises: split.exercises,
        cover_image: split.cover_image,
        creator : user?.name,
        creatorId : user?.id
      },
    }
  );

  return res;
};



// edit split util
  const handleSplitEdit = async () => {
  if (!selected) return;

  try {
    let editableSplit = selected;

    if (isPresetSplit(selected)) {
      showToast({
        type: "info",
        title: "Creating your own copy",
        message: "Preset splits can’t be edited directly.",
      });

      editableSplit = await createSplitFromPreset(selected);

      setSelected(editableSplit);
      await saveSplit(editableSplit);
    }

    setEditingSplit(editableSplit);
    setEditOpen(true);

  } catch (err) {
    showToast({
      type: "error",
      title: "Failed to prepare split",
      message: "Please try again.",
    });
  }
};

useEffect(() => {
  (async () => {
    const saved = await loadSplit();
    if (saved) setSelected(saved);
  })();
}, []);



const { user } = useUser();

const handleJoinJam = async (jamCode: string) => {
  if (!user?.id || joiningJam) return;

  setJoiningJam(true);

  try {
    const res = await apiFetch<{
      _id: string;
      name: string;
    }>("/jam/join", {
      method: "POST",
      body: {
        jamCode,
        userId: user.id,
      },
    });

    setJoinOpen(false);

    router.push({
      pathname: "/(protected)/jam",
      params: {
        id: res._id,
        name: res.name,
      },
    });

  } catch (err) {
    showToast({
      type: "error",
      title: "Jam already started or invalid code",
    });
    console.error("Join jam failed", err);
  } finally {
    setJoiningJam(false);
  }
};


// searching logic
const handleSearch = (text: string) => {
  setSearch(text);

  if (searchTimeout) clearTimeout(searchTimeout);

  if (!text.trim()) {
    setSearchResults([]);
    setSearching(false);
    return;
  }

  const timeout = setTimeout(async () => {
    try {
      setSearching(true);

      const res = await apiFetch<WorkoutSplit[]>(
        `/split/search?q=${encodeURIComponent(text)}`,
        { method: "POST" }
      );

      setSearchResults(res);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setSearching(false);
    }
  }, 400); // ⏱ debounce delay

  setSearchTimeout(timeout);
};





const handleCreateJam = async (payload: {
  title: string;
  exercises: any[];
}) => {
  if (!user?.id || creatingJam) return;

  setCreatingJam(true);

  try {
    const res = await apiFetch<{
      jamId: string;
      jamCode: string;
      title: string;
    }>("/jam/create", {
      method: "POST",
      body: {
        name: payload.title,
        leaderId: user.id,
        exercises: payload.exercises,
      },
    });

    setCreateOpen(false);

    router.push({
      pathname: "/(protected)/jam",
      params: {
        id: res.jamId,
        title: res.title,
      },
    });

  } catch (err) {
    console.error("Create jam failed", err);
    showToast({
      type: "error",
      title: "Failed to create Jam",
    });
  } finally {
    setCreatingJam(false);
  }
};





// create split util 
  const handleCreateSplit = () => {
  setEditingSplit({
    split_id: "new",                 // marker → will trigger POST /split/create on save
    split_name: "New Split",
    description: "",
    creator: user?.name || "You",
    creatorId: user?.id,             // important: marks it as user-owned
    exercises: [],
    cover_image: "",
    trusted: false,
    verified: false,
    trending: false,
  });

  setEditOpen(true);

  showToast({
    type: "info",
    title: "Create your own split",
    message: "Design your workout and save when ready 💪",
  });
};



// share split feature
const handleShareSplit = async () => {
  console.log('share clicked');
  if (!selected) return;

  try {
    setSharingSplit(true);
    let shareableSplit = selected;

    if (isPresetSplit(selected)) {
      showToast({
        type: "info",
        title: "Preparing split",
        message: "Creating a shareable copy…",
      });

      shareableSplit = await createSplitFromPreset(selected);

      setSelected(shareableSplit);
      await saveSplit(shareableSplit);
    }

    const res = await apiFetch<{
      shareUrl: string;
    }>(`/split/share/${shareableSplit.split_id}`, {
      method: "POST",
    });

    showToast({
      type: "success",
      title: "Split ready to share",
      message: "Link copied or ready to send ⚔️",
    });

    console.log("SHARE URL:", res.shareUrl);

  } catch (err) {
    console.error(err);
    showToast({
      type: "error",
      title: "Sharing failed",
      message: "Unable to share split.",
    });
  }finally{
    setSharingSplit(false);
  }
};
const splitsToShow =
  search.trim().length > 0 ? searchResults : MOCK_SPLITS;




// filter on days 
  const dayExercises =
    selected?.exercises?.filter(e =>
      e.day?.toLowerCase().startsWith(selectedDay.toLowerCase())
    ) ?? [];


  return (
    <View className="w-[100%] mx-auto mt-4">
           {/* ---------- SPLIT DROPDOWN ---------- */}
<View className="absolute z-40 right-6 left-6 mb-40">

  {/* SELECT BUTTON */}
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

  {/* DROPDOWN PANEL */}
  {open && (
    <ScrollView className="bg-zinc-900 mt-2 rounded-lg max-h-80 border border-zinc-700">

      {/* ---------- IMPORT SPLIT FROM LINK ---------- */}
      <View className="p-3 border-b border-zinc-700">
        <Text className="text-white font-bartle text-sm mb-2">
          Import split from link
        </Text>

        <TextInput
          value={shareLink}
          onChangeText={setShareLink}
          placeholder="Paste split link..."
          placeholderTextColor="#888"
          className="bg-zinc-800 px-3 py-2 rounded text-white font-ScienceGothic"
        />

        {shareLink.trim().length > 0 && (
          <TouchableOpacity
            onPress={handleImportSplit}
            disabled={importingSplit}
            className="mt-3 bg-white py-2 rounded-md flex-row justify-center items-center"
          >
            {importingSplit ? (
              <Text className="text-black font-ScienceGothic">
                Importing…
              </Text>
            ) : (
              <Text className="text-black font-ScienceGothic">
                Get Split
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* ---------- SEARCH BAR ---------- */}
      <View className="p-3 border-b border-zinc-700">
        <TextInput
          value={search}
          onChangeText={handleSearch}
          placeholder="Search splits..."
          placeholderTextColor="#888"
          className="bg-zinc-800 px-3 py-2 font-ScienceGothic rounded text-white"
        />
      </View>

      {/* ---------- SEARCH LOADER ---------- */}
      {searching && (
        <Text className="text-zinc-400 text-center py-4">
          Searching…
        </Text>
      )}

      {/* ---------- EMPTY SEARCH ---------- */}
      {!searching && search.trim() && searchResults.length === 0 && (
        <Text className="text-zinc-400 text-center py-4">
          No splits found
        </Text>
      )}

      {/* ---------- SPLIT RESULTS ---------- */}
      {!searching &&
        splitsToShow.map(split => (
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

            <Text className="text-zinc-400 text-xs font-ScienceGothic mt-1">
              {split.description}
            </Text>
          </TouchableOpacity>
        ))}
    </ScrollView>
  )}
</View>


{/* select split dropdown */}
      <ScrollView 
      className="w-[100%] mx-auto mt-4"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }} 
    >









      {/* ---------- WEEK CALENDAR ---------- */}
      <WeekCalendar
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
  disabled={savingSplit}
  className="flex-1 bg-white py-3 rounded-md flex-row justify-center items-center"
>
  {savingSplit ? (
    <ActivityIndicator color="black" />
  ) : (
    <Text className="text-black font-ScienceGothic">Edit</Text>
  )}
</TouchableOpacity>


          {/* SHARE */}
          <TouchableOpacity
            onPress={handleShareSplit}
            className="flex-1 bg-white py-3 rounded-md"
          >
           {sharingSplit ? (
    <ActivityIndicator color="black" />
  ) : (
    <Text className="text-black font-ScienceGothic text-center">Share</Text>
  )}
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


  <View className="w-full items-center mt-6">
  <WorkoutJamPromoCard
  onJoin={() => setJoinOpen(true)}
  onCreate={() => setCreateOpen(true)}
  videoId="kKAY7YaBVWM"
/>

</View>



<JoinWorkoutJamModal
  visible={joinOpen}
  onClose={() => setJoinOpen(false)}
  onJoin={handleJoinJam}
  promoImage="https://images.unsplash.com/photo-1599058917212-d750089bc07e"
  onVisitPromo={() => {
    console.log("Visit sponsor");
  }}
  loading={joiningJam}
/>
<CreateWorkoutJamModal
  visible={createOpen}
  onClose={() => setCreateOpen(false)}
  onCreate={handleCreateJam}
  loading = {creatingJam}
/>




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
  if (savingSplit) return;

  try {
    setSavingSplit(true);

    let finalSplit = updated;

    if (updated.split_id === "new") {
      finalSplit = await apiFetch<WorkoutSplit>("/split/create", {
        method: "POST",
        body: {
          split_name: updated.split_name,
          description: updated.description,
          exercises: updated.exercises,
          cover_image: updated.cover_image,
          creator: user?.name,
          creatorId: user?.id,
        },
      });

      showToast({
        type: "success",
        title: "Split created",
      });
    } else {
      await apiFetch(`/split/${updated.split_id}`, {
        method: "PUT",
        body: {
          userId: user?.id,
          split_name: updated.split_name,
          description: updated.description,
          exercises: updated.exercises,
          cover_image: updated.cover_image,
          trending: updated.trending,
          trusted: updated.trusted,
          verified: updated.verified,
        },
      });

      showToast({
        type: "success",
        title: "Split updated",
      });
    }

    setSelected(finalSplit);
    await saveSplit(finalSplit);
    setEditOpen(false);

  } catch {
    showToast({
      type: "error",
      title: "Save failed",
    });
  } finally {
    setSavingSplit(false);
  }
}}

/>



</ScrollView>


    </View>
  );
}
