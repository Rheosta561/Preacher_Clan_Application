import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { MotiView } from "moti";
import { Flame, ShieldCheck, CheckCheck } from "lucide-react-native";
import { WorkoutSplit } from "@/constants/split";

const { width } = Dimensions.get("window");

interface Props {
  split: WorkoutSplit;
  onUseSplit?: (split : WorkoutSplit) => void;
  onOpenSplit?: (split: WorkoutSplit) => void;
  splitInUseId?: string;
}




const SuggestedSplitCard = ({ split, onUseSplit, onOpenSplit , splitInUseId }: Props) => {
  const totalDays = new Set(split.exercises.map(e => e.day)).size;
  const isInUse = splitInUseId === split.split_id;
//   console.log('split id ' , split.split_id ,' is in use', isInUse , 'used split ' , splitInUseId)


  return (
    <MotiView
      from={{ opacity: 0, translateY: 14 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 400 }}
      className="rounded-2xl mx-4 overflow-hidden bg-red-600 border border-black shadow-xl"
      style={{ width: width * 0.88 }}
    >

{/* cover */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onOpenSplit?.(split)}
        className="relative"
      >
        <Image
          source={{
            uri:
              split.cover_image ??
              "https://placehold.co/800x500?text=Warrior+Split",
          }}
          className="w-full h-44"
        />

        <View className="absolute inset-0 bg-black/20" />

{/* badges */}
        <View className="absolute top-3 right-3 flex-col gap-2">
          {split.trending && (
            <View className="px-3 py-1.5 rounded-lg bg-white flex-row items-center">
              <Flame size={16} color="black" />
              <Text className="ml-1 text-black font-ScienceGothic text-xs">
                Trending
              </Text>
            </View>
          )}

          {split.trusted && (
            <View className="px-3 py-1.5 rounded-lg bg-amber-400 flex-row items-center">
              <ShieldCheck size={16} color="black" />
              <Text className="ml-1 text-black font-ScienceGothic text-xs">
                Trusted
              </Text>
            </View>
          )}

          {(split as any).verified && (
            <View className="px-3 py-1.5 rounded-full bg-blue-300/90 flex-row items-center">
              <CheckCheck size={16} color="black" />
              <Text className="ml-1 text-black font-ScienceGothic text-xs">
                Verified
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

{/* body  */}
      <View className="p-4">

        <Text className="text-black font-bartle text-xl mb-2">
          {split.split_name}
        </Text>

        <Text className="text-zinc-900 font-ScienceGothic text-sm leading-5 mb-3">
          {split.description}
        </Text>

        {/* CREATOR */}
        <View className="flex-row items-center gap-2 mb-3">
          <View className="h-7 w-7 rounded-full bg-zinc-700" />
          <Text className="text-zinc-900 font-ScienceGothic text-xs">
            Created by <Text className="text-white">{split.creator}</Text>
          </Text>
        </View>

        {/* TAGS */}
        <View className="flex-row flex-wrap gap-2 mb-4">
          <View className="bg-zinc-950 px-2 py-1 rounded-lg">
            <Text className="text-amber-300 text-xs font-ScienceGothic">
              {split.exercises.length} Exercises
            </Text>
          </View>

          <View className="bg-zinc-950 px-2 py-1 rounded-lg">
            <Text className="text-amber-300 text-xs font-ScienceGothic">
              {totalDays} Day Program
            </Text>
          </View>
        </View>

        {/* =============== ACTION BUTTONS =============== */}
        <View className="flex-row gap-3">

          {/* VIEW DETAILS */}
          <TouchableOpacity
            onPress={() => onOpenSplit?.(split)}
            className="flex-1 bg-black py-2 rounded-md border border-zinc-900"
          >
            <Text className="text-center text-white font-ScienceGothic">
              View Details
            </Text>
          </TouchableOpacity>


          {!isInUse &&  <TouchableOpacity
            onPress={() => onUseSplit?.(split)}
            className="flex-1 bg-white py-2 rounded-md"
          >
            <Text className="text-center text-black font-ScienceGothic">
              Use This Split
            </Text>
          </TouchableOpacity> }
         

        </View>
      </View>
    </MotiView>
  );
};

export default SuggestedSplitCard;
