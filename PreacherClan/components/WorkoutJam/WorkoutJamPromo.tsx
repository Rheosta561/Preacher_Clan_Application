import React, { useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { MotiView } from "moti";
import { Users, Swords } from "lucide-react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native";

const { width } = Dimensions.get("window");
const HEIGHT = 340;

interface Props {
  videoId: string;
  onJoin: () => void;
  onCreate: () => void;
}

export default function WorkoutJamPromoCard({
  videoId,
  onJoin,
  onCreate,
}: Props) {
  const [playing] = useState(true);

  return (
    <MotiView
      from={{ opacity: 0, translateY: 25 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 400 }}
      className="rounded-2xl overflow-hidden border border-zinc-800 bg-red-900"
      style={{ width: width - 32, height: HEIGHT }}
    >

      <YoutubePlayer
        height={HEIGHT}
        width={width}
        videoId={videoId}
        play={playing}
        mute={false}
        webViewStyle={{ opacity: 0.9 }}
        initialPlayerParams={{
          controls: false,
          modestbranding: true,
          playsinline: true,
          loop: true,
          rel: false,
        }}
      />


      <LinearGradient
        colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0.85)"]}
        className="absolute inset-0"
      />


      <View className="absolute inset-0 p-5 justify-between">
        {/* TAGS */}
        

        {/* TITLE */}
        <View>
          <Text className="text-white text-2xl font-bartle">
            VALHALLA JAM
          </Text>
          <Text className="text-zinc-300 mt-1 text-sm font-ScienceGothic">
            Train together. Finish together. Rise together.
          </Text>
        </View>

        {/* ACTIONS */}
        <View className="flex flex-col gap-4">
            <View className="flex-row flex-wrap gap-2">
          <Tag text="Live Group Workout" />
          <Tag text="Sync Reps" />
          <Tag text="+20 Preacher Score" />
          <Tag text="Brotherhood Mode" />
        </View>
          <View className="flex-row items-center justify-center gap-3">

          <ActionButton
            icon={<Users size={18} color="black" />}
            text="Join Jam"
            onPress={onJoin}
          />
          <ActionButton
            icon={<Swords size={18} color="white" />}
            text="Create"
            onPress={onCreate}
            variant="outline"
          />
        </View>
        </View>
      
      </View>
    </MotiView>
  );
}

/* ================= COMPONENTS ================= */

const Tag = ({ text }: { text: string }) => (
  <View className="bg-zinc-900/80 border border-zinc-700 px-3 py-1 rounded-lg">
    <Text className="text-zinc-200 text-xs font-ScienceGothic">
      {text}
    </Text>
  </View>
);

const ActionButton = ({
  text,
  icon,
  onPress,
  variant = "solid",
}: {
  text: string;
  icon: React.ReactNode;
  onPress: () => void;
  variant?: "solid" | "outline";
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    className={`flex-row items-center gap-2 px-4 w-1/2 justify-center py-2 rounded-md ${
      variant === "solid"
        ? "bg-white"
        : "border bg-black border-zinc-950"
    }`}
  >
    {icon}
    <Text
      className={`text-sm font-ScienceGothic ${
        variant === "solid" ? "text-black" : "text-white"
      }`}
    >
      {text}
    </Text>
  </TouchableOpacity>
);
